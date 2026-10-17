import { ConsultaRepository } from '../domain/ConsultaRepository';
import { Consulta } from '../domain/Consulta';
import { CrearConsultaDTO } from './CrearConsultaDTO';

export class ConsultaService {
  private readonly ROL_MEDICO = 1;

  constructor(private readonly repo: ConsultaRepository) {}

  async crearConsultaMedica(dto: CrearConsultaDTO, rolEjecutor: number): Promise<void> {
    // 🛡️ Regla de oro: Solo el médico puede diagnosticar
    if (rolEjecutor !== this.ROL_MEDICO) {
      throw new Error('Acceso denegado: Solo el personal Médico (Rol 1) está autorizado para emitir diagnósticos y recetas.');
    }

    // 🚫 Validaciones de campos obligatorios institucionales
    if (!dto.idCita || !dto.dniPaciente || !dto.idMedico) {
      throw new Error('🚫 Validación: La información de la cita, paciente y médico son obligatorios.');
    }

    if (!dto.diagnostico || dto.diagnostico.trim().length < 5) {
      throw new Error('🚫 Validación: Debes ingresar un diagnóstico clínico válido y descriptivo.');
    }

    // Adaptamos el DTO a la entidad de dominio limpia
    const nuevaConsulta = new Consulta(
      0,
      dto.idCita,
      dto.dniPaciente,
      dto.idMedico,
      dto.diagnostico.trim(),
      dto.observaciones.trim()
    );

    const medicamentosRecetados = dto.medicamentos || [];

    // Enviamos al repositorio transaccional
    await this.repo.crearTransaccional(nuevaConsulta, medicamentosRecetados);
  }
}