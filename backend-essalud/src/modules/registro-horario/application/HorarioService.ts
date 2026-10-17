import { HorarioRepository } from '../domain/HorarioRepository';
import { Horario } from '../domain/Horario';
import { HorarioBuilder } from '../domain/HorarioBuilder';
import { CrearHorarioDTO } from './CrearHorarioDTO';

export class HorarioService {
  private readonly ROLES_PERMITIDOS = [1]; 
  private readonly DURACION_CITA_MINUTOS = 30;
  private readonly INTERVALO_HOLGURA_MINUTOS = 10;
  private readonly ROL_MEDICO = 1;

  constructor(private readonly repo: HorarioRepository) {}

  async crear(dto: CrearHorarioDTO, rolEjecutor: number): Promise<Horario> {
    if (!this.ROLES_PERMITIDOS.includes(rolEjecutor)) {
      throw new Error('Acceso denegado: Solo el personal Médico (Rol 1) está autorizado.');
    }

    if (!dto.cantidadPacientes || dto.cantidadPacientes <= 0) {
      throw new Error('🚫 Validación: Debes ingresar una cantidad de pacientes mayor a 0.');
    }

    const factorSalto = this.DURACION_CITA_MINUTOS + this.INTERVALO_HOLGURA_MINUTOS; 
    const minutosTotalesAgenda = (dto.cantidadPacientes * factorSalto) - this.INTERVALO_HOLGURA_MINUTOS;

    let minutosActual = this.timeToMinutes(dto.horaInicio);
    const minutosFinCalculado = minutosActual + minutosTotalesAgenda;
    const horaFinString = this.minutesToTime(minutosFinCalculado);

    this.validarLimitesTurno(dto.turno, dto.horaInicio, horaFinString);

    await this.verificarChoqueDeHoras(dto.dni, dto.fecha, dto.horaInicio, horaFinString);

    let ultimoHorarioCreado: Horario | null = null;

    for (let i = 0; i < dto.cantidadPacientes; i++) {
      const minutosFinCita = minutosActual + this.DURACION_CITA_MINUTOS;

      const stringInicioSlot = this.minutesToTime(minutosActual);
      const stringFinSlot = this.minutesToTime(minutosFinCita);

      const slotAtomico = new HorarioBuilder()
        .conId(0)
        .conDni(dto.dni)
        .conFecha(dto.fecha)
        .conHoraInicio(stringInicioSlot)
        .conHoraFin(stringFinSlot)
        .conTurno(dto.turno)
        .conEstado(true)
        .build();

      (slotAtomico as any).estado = 'DISPONIBLE';

      ultimoHorarioCreado = await this.repo.crear(slotAtomico);
      minutosActual += factorSalto;
    }

    return ultimoHorarioCreado!;
  }

  async listar(rolEjecutor: number, dniEjecutor: string): Promise<Horario[]> {
    const todosLosHorarios = await this.repo.listar();

    if (rolEjecutor === this.ROL_MEDICO) {
      return todosLosHorarios.filter(horario => horario.dni === dniEjecutor);
    }

    return todosLosHorarios;
  }

  async obtenerPorId(id: number): Promise<Horario | null> {
    return await this.repo.obtenerPorId(id);
  }

  async actualizar(id: number, datos: Partial<Horario>, rolEjecutor: number): Promise<Horario | null> {
    if (!this.ROLES_PERMITIDOS.includes(rolEjecutor)) {
      throw new Error('Acceso denegado: Permisos insuficientes.');
    }
    return await this.repo.actualizar(id, datos);
  }

  async eliminar(id: number, rolEjecutor: number): Promise<boolean> {
    if (!this.ROLES_PERMITIDOS.includes(rolEjecutor)) {
      throw new Error('Acceso denegado.');
    }
    return await this.repo.eliminar(id);
  }

  private timeToMinutes(timeStr: string): number {
    if (!timeStr || !timeStr.includes(':')) return 0;
    const [horasRaw, minutosRaw] = timeStr.split(':').map(Number);
    return (horasRaw ?? 0) * 60 + (minutosRaw ?? 0);
  }

  private minutesToTime(totalMinutos: number): string {
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
  }

  private validarLimitesTurno(turno: string, horaInicio: string, horaFin: string): void {
    if (turno === 'MAÑANA') {
      const inicioInvalido = horaInicio < '06:00' || horaInicio > '08:00';
      const finInvalido = horaFin > '14:00';
      if (inicioInvalido || finInvalido) {
        throw new Error(`🚫 Exceso de Capacidad: Con esa cantidad de pacientes, tu salida sería a las ${horaFin}. Para el turno MAÑANA, el límite máximo de salida es a las 14:00.`);
      }
    } 
    else if (turno === 'TARDE') {
      const inicioInvalido = horaInicio < '12:00' || horaInicio > '14:00';
      const finInvalido = horaFin > '20:00';
      if (inicioInvalido || finInvalido) {
        throw new Error(`🚫 Exceso de Capacidad: Con esa cantidad de pacientes, tu salida sería a las ${horaFin}. Para el turno TARDE, el límite máximo de salida es a las 20:00.`);
      }
    } 
    else if (turno === 'NOCHE') {
      const inicioInvalido = horaInicio < '18:00' || horaInicio > '20:00';
      const finInvalido = horaFin > '08:00';
      if (inicioInvalido || finInvalido) {
        throw new Error(`🚫 Exceso de Capacidad: Tu salida excedería el límite del descanso obligatorio del turno NOCHE.`);
      }
    }
  }

  private async verificarChoqueDeHoras(dni: string, fecha: string, horaInicio: string, horaFin: string): Promise<void> {
    const guardiasDelDia = await this.repo.buscarPorMedicoYFecha(dni, fecha);

    for (const existente of guardiasDelDia) {
      let seSolapan = horaInicio < existente.horaFin && horaFin > existente.horaInicio;
      if (existente.turno === 'NOCHE') seSolapan = true;

      if (seSolapan) {
        throw new Error(`🚫 Conflicto de Agenda: Al calcular tus cupos, se cruzan con un turno existente de ${existente.horaInicio} a ${existente.horaFin}.`);
      }
    }
  }
}