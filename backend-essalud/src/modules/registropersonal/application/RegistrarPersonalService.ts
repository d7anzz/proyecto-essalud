import { PersonalRepository } from '../domain/PersonalRepository';
import { Personal }           from '../domain/Personal';
import { Usuario }            from '../../login/domain/Usuario'; 
import bcrypt                 from 'bcryptjs';
import { RegistrarPersonalDTO } from './RegistrarPersonalDTO';

export class RegistrarPersonalService {
  private readonly ROLES_PERMITIDOS_EJECUTOR = [2, 4]; 
  private readonly ROLES_VALIDOS_SISTEMA = [1, 2, 3, 4]; // 1: Médico, 2: Admin, 3: Recepción, 4: Jefe

  constructor(private readonly personalRepository: PersonalRepository) {}

  async ejecutar(dto: RegistrarPersonalDTO, rolEjecutor: number): Promise<void> {
    if (!this.ROLES_PERMITIDOS_EJECUTOR.includes(rolEjecutor)) {
      throw new Error('Acceso denegado: Solo el Jefe de Hospital o el personal Administrativo están autorizados para registrar nuevos usuarios.');
    }

    if (!dto.idRol || !this.ROLES_VALIDOS_SISTEMA.includes(dto.idRol)) {
      throw new Error('Rol inválido');
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
      dto.idEspecialidad || null,
      undefined,
      dto.telefono || null,
      dto.fecNac || null
    );

    await this.personalRepository.guardarPersonalYCredenciales(credencialesUsuario, nuevoPersonal);
  }
}