import { PersonalRepository } from '../domain/PersonalRepository';
import { Personal }           from '../domain/Personal';
import { Usuario }            from '../../login/domain/Usuario'; 
import bcrypt                 from 'bcryptjs';

export interface RegistrarPersonalDTO {
  dni: string;
  nombre: string;
  apellidos: string;
  username: string;
  idRol: number; 
  colegiatura?: string | null;
  idEspecialidad?: number | null;
}

export class RegistrarPersonalService {
  private readonly ROLES_PERMITIDOS = [2, 4]; 

  constructor(private readonly personalRepository: PersonalRepository) {}

  async ejecutar(dto: RegistrarPersonalDTO, rolEjecutor: number): Promise<void> {
    if (!this.ROLES_PERMITIDOS.includes(rolEjecutor)) {
      throw new Error('Acceso denegado: Solo el Jefe de Hospital o el personal Administrativo están autorizados para registrar nuevos usuarios.');
    }

    const existePersonal = await this.personalRepository.existePorDni(dto.dni);
    if (existePersonal) {
      throw new Error(`El DNI ${dto.dni} ya se encuentra registrado en el sistema.`);
    }

    const passwordPorDefecto = dto.dni;
    Usuario.validarPassword(passwordPorDefecto);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPorDefecto, salt);

    const credencialesUsuario = new Usuario(
      dto.dni,
      dto.username,
      passwordHash,
      dto.idRol,     
      1,            
      0,            
      true          
    );

    const nuevoPersonal = new Personal(
      dto.dni,
      dto.nombre,
      dto.apellidos,
      dto.idRol, 
      dto.colegiatura || null,  
      dto.idEspecialidad || null 
    );

    await this.personalRepository.guardarPersonalYCredenciales(credencialesUsuario, nuevoPersonal);
  }
}