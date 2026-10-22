import { ConsultaRepository } from '../domain/ConsultaRepository';
import { Consulta } from '../domain/Consulta';
import { CrearConsultaDTO } from './CrearConsultaDTO';
import { CitaRepository } from '../../citas/domain/CitaRepository';

export class ConsultaService {
  private readonly ROL_MEDICO = 1;

  constructor(
    private readonly repo: ConsultaRepository,
    private readonly citaRepo?: CitaRepository
  ) {}

  async crearConsultaMedica(dto: CrearConsultaDTO, rolEjecutor: number): Promise<void> {
    if (rolEjecutor !== this.ROL_MEDICO) {
      throw new Error('Acceso denegado: Solo el personal Médico (Rol 1) está autorizado para emitir diagnósticos y recetas.');
    }

    if (!dto.idCita || !dto.dniPaciente || !dto.idMedico) {
      throw new Error('Validación: La información de la cita, paciente y médico son obligatorios.');
    }

    if (this.citaRepo) {
      const cita = await this.citaRepo.obtenerPorId(dto.idCita);
      if (cita && cita.estado === 'COMPLETADA') {
        throw new Error('La cita ya ha sido atendida previamente');
      }
    }

    const diagnosticoLimpio = dto.diagnostico ? dto.diagnostico.trim() : '';
    if (diagnosticoLimpio.length < 5 || diagnosticoLimpio.length > 1000) {
      throw new Error('El diagnóstico debe tener entre 5 y 1000 caracteres');
    }

    const medicamentosRecetados = dto.medicamentos || [];
    for (const med of medicamentosRecetados) {
      if (med.cantidadRecetada < 0) {
        throw new Error('La cantidad debe ser mayor o igual a 0');
      }
      if (med.cantidadRecetada > 100) {
        throw new Error('El máximo recetable es de 100 unidades');
      }
    }

    const nuevaConsulta = new Consulta(
      0,
      dto.idCita,
      dto.dniPaciente,
      dto.idMedico,
      diagnosticoLimpio,
      dto.observaciones ? dto.observaciones.trim() : ''
    );

    await this.repo.crearTransaccional(nuevaConsulta, medicamentosRecetados);
  }
}