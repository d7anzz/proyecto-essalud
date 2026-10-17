import { Paciente } from '../domain/Paciente';
import { PacienteRepository } from '../domain/PacienteRepository';
import { CreatePacienteDTO } from './CrearPacienteDTO';
import { PacienteBuilder } from '../domain/PacienteBuilder';

export class PacienteService {
  private readonly ROLES_PERMITIDOS = [2]; 

  constructor(private pacienteRepository: PacienteRepository) {}

  async ejecutar(dto: CreatePacienteDTO, rolEjecutor: number): Promise<void> {
    if (!this.ROLES_PERMITIDOS.includes(rolEjecutor)) {
      throw new Error('Acceso denegado: Solo el personal Administrativo está autorizado para registrar nuevos pacientes.');
    }
    const existePaciente = await this.pacienteRepository.buscarPorDni(dto.dni);
    if (existePaciente) {
      throw new Error("El paciente con este DNI ya está registrado.");
    }
    const nuevoPaciente = new PacienteBuilder()
      .setDni(dto.dni)
      .setNombre(dto.nombre)
      .setApellidos(dto.apellidos)
      .setFechaNacimiento(dto.fechaNacimiento)
      .build();
    await this.pacienteRepository.guardar(nuevoPaciente);
  }

  async listarPacientes(): Promise<Paciente[]> {
    return await this.pacienteRepository.obtenerTodos();
  }

  async buscarPorDni(dni: string): Promise<Paciente[]> {
    return await this.pacienteRepository.buscarCoincidenciasPorDni(dni);
  }

  async actualizarPaciente(dni: string, dto: any): Promise<void> {
    const pacienteExistente = await this.pacienteRepository.buscarPorDni(dni);
    if (!pacienteExistente) {
      throw new Error("El paciente que intenta modificar no existe en el sistema.");
    }

    const pacienteActualizado = new PacienteBuilder()
      .setDni(dni) 
      .setNombre(dto.nombre || pacienteExistente.nombre)
      .setApellidos(dto.apellidos || pacienteExistente.apellidos)
      .setFechaNacimiento(dto.fechaNacimiento || (pacienteExistente as any).fechaNacimiento || (pacienteExistente as any).fec_nac)
      .build();

    await this.pacienteRepository.guardar(pacienteActualizado);
  }

  async eliminarPaciente(dni: string): Promise<void> {
    const pacienteExistente = await this.pacienteRepository.buscarPorDni(dni);
    if (!pacienteExistente) {
      throw new Error("El paciente que intenta eliminar no se encuentra registrado.");
    }

    await this.pacienteRepository.eliminarPorDni(dni);
  }
}