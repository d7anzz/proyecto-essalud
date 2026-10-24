import { CitaRepository } from '../domain/CitaRepository';
import { Cita } from '../domain/Cita';
import { HorarioRepository } from '../../registro-horario/domain/HorarioRepository'; 
import { CrearCitaDTO } from './CrearCitaDTO';

export class CitaService {
  private readonly ROL_ADMINISTRATIVO = 2;
  private readonly ROL_MEDICO = 1;

  constructor(
    private readonly repo: CitaRepository,
    private readonly horarioRepo: HorarioRepository, 
    private readonly pacienteRepo?: any
  ) {}

  async crear(dto: CrearCitaDTO, rolEjecutor: number): Promise<Cita> {
    if (rolEjecutor !== this.ROL_ADMINISTRATIVO) {
      throw new Error('Acceso denegado: Solo el personal administrativo (Rol 2) está autorizado para agendar citas.');
    }

    // 1. Validación de Médico
    if (!dto.dniMedico || String(dto.dniMedico).trim() === '') {
      throw new Error('Debe seleccionar un médico');
    }

    // 2. Validación de formato de DNI de paciente (8 dígitos numéricos)
    const dniRegex = /^\d{8}$/;
    if (!dniRegex.test(dto.dniPaciente)) {
      throw new Error('DNI con formato inválido');
    }

    // 3. Validación de existencia del paciente de forma robusta
    if (this.pacienteRepo) {
      let paciente = null;
      if (typeof this.pacienteRepo.obtenerPorDni === 'function') {
        paciente = await this.pacienteRepo.obtenerPorDni(dto.dniPaciente);
      } else if (typeof this.pacienteRepo.buscarPorDni === 'function') {
        paciente = await this.pacienteRepo.buscarPorDni(dto.dniPaciente);
      } else if (typeof this.pacienteRepo.findOneBy === 'function') {
        paciente = await this.pacienteRepo.findOneBy({ dni: dto.dniPaciente });
      }

      if (!paciente) {
        throw new Error('Paciente no registrado');
      }
    }

    // 4. Validación de Horario / Slot
    const horario = await this.horarioRepo.obtenerPorId(Number(dto.idHorario));
    if (!horario) {
      throw new Error('Error de Consistencia: El bloque de horario seleccionado no existe en el sistema.');
    }

    // 5. Validación de Fecha (No permitir fechas pasadas)
    if (horario.fecha) {
      const hoyStr = new Date().toISOString().split('T')[0]!;
      const fechaHorarioStr = String(horario.fecha).split('T')[0]!;

      if (fechaHorarioStr < hoyStr) {
        throw new Error('Fecha inválida');
      }
    }

    // 6. Validación de Especialidad
    const especialidadEfectiva = (horario as any).idEspecialidad || (horario as any).personal?.idEspecialidad || (horario as any).personal?.id_especialidad;
    if (especialidadEfectiva === undefined || especialidadEfectiva === null || String(especialidadEfectiva).trim() === '') {
      const especialidadDto = (dto as any).idEspecialidad;
      if (especialidadDto === undefined || especialidadDto === null || String(especialidadDto).trim() === '') {
        throw new Error('Debe seleccionar una especialidad');
      }
    }

    // Comprobación flexible de estado disponible
    const estadoHorario = (horario as any).estado;
    const esDisponible = estadoHorario === 'DISPONIBLE' || estadoHorario === 1 || estadoHorario === true || estadoHorario === '1';
    
    if (!esDisponible) {
      throw new Error('Horario inválido');
    }

    await this.horarioRepo.actualizar(horario.id, { estado: 'OCUPADO' });

    const cita = new Cita(
      0,
      dto.dniPaciente,
      horario.dni,      
      horario.id,        
      'PENDIENTE' 
    );

    try {
      const nuevaCita = await this.repo.crear(cita);

      if (horario && (horario as any).personal) {
        (nuevaCita as any).personal = {
          nombre: (horario as any).personal.nombre,
          apellidos: (horario as any).personal.apellidos,
          especialidad: (horario as any).personal.especialidad
        };
      }

      return nuevaCita;
    } catch (error) {
      await this.horarioRepo.actualizar(horario.id, { estado: 'DISPONIBLE' });
      throw error;
    }
  }

  async listar(rolEjecutor: number, dniUsuarioLogueado: string): Promise<Cita[]> {
    const todasLasCitas = await this.repo.listar();

    const citasHidratadas = await Promise.all(
      todasLasCitas.map(async (cita) => {
        if (cita.idHorario) {
          const horarioAsociado = await this.horarioRepo.obtenerPorId(cita.idHorario);
          if (horarioAsociado && (horarioAsociado as any).personal) {
            (cita as any).personal = {
              nombre: (horarioAsociado as any).personal.nombre,
              apellidos: (horarioAsociado as any).personal.apellidos,
              especialidad: (horarioAsociado as any).personal.especialidad
            };
          }
        }
        return cita;
      })
    );

    if (rolEjecutor === this.ROL_MEDICO) {
      return citasHidratadas.filter(c => c.idMedico === dniUsuarioLogueado);
    }

    return citasHidratadas;
  }

  async obtenerPorId(id: number, rolEjecutor: number, dniUsuarioLogueado: string): Promise<Cita | null> {
    const cita = await this.repo.obtenerPorId(id);
    if (!cita) return null;

    if (rolEjecutor === this.ROL_MEDICO && cita.idMedico !== dniUsuarioLogueado) {
      throw new Error('Acceso denegado: No tienes permisos para visualizar esta cita.');
    }

    if (cita.idHorario) {
      const horarioAsociado = await this.horarioRepo.obtenerPorId(cita.idHorario);
      if (horarioAsociado && (horarioAsociado as any).personal) {
        (cita as any).personal = {
          nombre: (horarioAsociado as any).personal.nombre,
          apellidos: (horarioAsociado as any).personal.apellidos,
          especialidad: (horarioAsociado as any).personal.especialidad
        };
      }
    }

    return cita;
  }

  async actualizar(id: number, data: Partial<Cita>, rolEjecutor: number): Promise<Cita | null> {
    const citaExistente = await this.repo.obtenerPorId(id);
    if (!citaExistente) throw new Error('La cita solicitada no existe.');

    if (data.estado === 'CANCELADA') {
      await this.horarioRepo.actualizar(citaExistente.idHorario, { estado: 'DISPONIBLE' });
    }

    return this.repo.actualizar(id, data);
  }

  async eliminar(id: number, rolEjecutor: number): Promise<boolean> {
    if (rolEjecutor !== this.ROL_ADMINISTRATIVO) {
      throw new Error('Acceso denegado: Solo el personal administrativo puede remover registros del sistema.');
    }

    const citaExistente = await this.repo.obtenerPorId(id);
    if (!citaExistente) throw new Error('La cita solicitada no existe.');

    await this.horarioRepo.actualizar(citaExistente.idHorario, { estado: 'DISPONIBLE' });

    return this.repo.eliminar(id);
  }
}