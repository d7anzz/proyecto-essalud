import { Personal } from '../Personal';
import { RegistrarPersonalService } from '../../application/RegistrarPersonalService';
import { RegistrarPersonalDTO } from '../../application/RegistrarPersonalDTO';
import { PersonalRepository } from '../PersonalRepository';

describe('Pruebas Unitarias - Módulo Personal de Salud (Casos ID 30 al 68)', () => {
  let mockPersonalRepo: jest.Mocked<PersonalRepository>;
  let service: RegistrarPersonalService;

  const ROL_JEFE_HOSPITAL = 4;

  beforeEach(() => {
    mockPersonalRepo = {
      existePorDni: jest.fn().mockResolvedValue(false),
      guardarPersonalYCredenciales: jest.fn().mockResolvedValue(undefined),
      obtenerEspecialidadPorDni: jest.fn().mockResolvedValue(null),
    };

    service = new RegistrarPersonalService(mockPersonalRepo);
  });

  // =========================================================
  // BLOQUE 1: VALIDACIONES DE DNI (IDs 30 - 35)
  // =========================================================
  describe('Pruebas de Componente: DNI (IDs 30 - 35)', () => {
    it('ID 30: Registrar con DNI válido (12345678)', () => {
      const p = new Personal('12345678', 'Juan', 'Perez', 2);
      expect(p.dni).toBe('12345678');
    });

    it('ID 31: Rechazar DNI mayor a 8 dígitos (100000000)', () => {
      expect(() => new Personal('100000000', 'Juan', 'Perez', 2)).toThrow(
        'El DNI del personal debe tener exactamente 8 dígitos.'
      );
    });

    it('ID 32: Rechazar DNI menor a 8 dígitos (9999999)', () => {
      expect(() => new Personal('9999999', 'Juan', 'Perez', 2)).toThrow(
        'El DNI del personal debe tener exactamente 8 dígitos.'
      );
    });

    it('ID 33: Rechazar DNI con letras (1234A567)', () => {
      expect(() => new Personal('1234A567', 'Juan', 'Perez', 2)).toThrow(
        'El DNI debe contener únicamente números'
      );
    });

    it('ID 34: Rechazar DNI con espacios (1234 5678)', () => {
      expect(() => new Personal('1234 5678', 'Juan', 'Perez', 2)).toThrow(
        'El DNI del personal debe tener exactamente 8 dígitos.'
      );
    });

    it('ID 35: Rechazar DNI negativo (-12345678)', () => {
      expect(() => new Personal('-12345678', 'Juan', 'Perez', 2)).toThrow(
        'El DNI del personal debe tener exactamente 8 dígitos.'
      );
    });
  });

  // =========================================================
  // BLOQUE 2: VALIDACIONES DE NOMBRE (IDs 36 - 41)
  // =========================================================
  describe('Pruebas de Componente: Nombre (IDs 36 - 41)', () => {
    it('ID 36: Registrar con Nombre válido ("Juan")', () => {
      const p = new Personal('12345678', 'Juan', 'Perez', 2);
      expect(p.nombre).toBe('Juan');
    });

    it('ID 37: Rechazar Nombre > 50 caracteres', () => {
      const nombreLargo = 'A'.repeat(51);
      expect(() => new Personal('12345678', nombreLargo, 'Perez', 2)).toThrow(
        'El nombre debe tener entre 3 y 50 caracteres'
      );
    });

    it('ID 38: Rechazar Nombre < 3 caracteres ("Jo")', () => {
      expect(() => new Personal('12345678', 'Jo', 'Perez', 2)).toThrow(
        'El nombre debe tener entre 3 y 50 caracteres'
      );
    });

    it('ID 39: Rechazar Nombre vacío', () => {
      expect(() => new Personal('12345678', '   ', 'Perez', 2)).toThrow(
        'El nombre y los apellidos son campos obligatorios para el registro.'
      );
    });

    it('ID 40: Rechazar Nombre con números ("Juan123")', () => {
      expect(() => new Personal('12345678', 'Juan123', 'Perez', 2)).toThrow(
        'El nombre debe contener únicamente letras'
      );
    });

    it('ID 41: Rechazar Nombre con símbolos ("Juan@")', () => {
      expect(() => new Personal('12345678', 'Juan@', 'Perez', 2)).toThrow(
        'El nombre debe contener únicamente letras'
      );
    });
  });

  // =========================================================
  // BLOQUE 3: VALIDACIONES DE APELLIDO (IDs 42 - 45)
  // =========================================================
  describe('Pruebas de Componente: Apellido (IDs 42 - 45)', () => {
    it('ID 42: Rechazar Apellido > 50 caracteres', () => {
      const apellidoLargo = 'B'.repeat(51);
      expect(() => new Personal('12345678', 'Juan', apellidoLargo, 2)).toThrow(
        'El apellido debe tener entre 3 y 50 caracteres'
      );
    });

    it('ID 43: Rechazar Apellido < 3 caracteres ("Aa")', () => {
      expect(() => new Personal('12345678', 'Juan', 'Aa', 2)).toThrow(
        'El apellido debe tener entre 3 y 50 caracteres'
      );
    });

    it('ID 44: Registrar Apellido válido ("Pérez")', () => {
      const p = new Personal('12345678', 'Juan', 'Pérez', 2);
      expect(p.apellidos).toBe('Pérez');
    });

    it('ID 45: Rechazar Apellido con símbolos/números ("Perez_2")', () => {
      expect(() => new Personal('12345678', 'Juan', 'Perez_2', 2)).toThrow(
        'El apellido debe contener únicamente letras'
      );
    });
  });

  // =========================================================
  // BLOQUE 4: VALIDACIONES DE FECHA DE NACIMIENTO (IDs 46 - 51)
  // =========================================================
  describe('Pruebas de Componente: Fecha de Nacimiento (IDs 46 - 51)', () => {
    it('ID 46: Fecha válida ("15/05/1995")', () => {
      const p = new Personal('12345678', 'Juan', 'Perez', 2, null, null, undefined, null, '1995-05-15');
      expect(p.fecNac).toBe('1995-05-15');
    });

    it('ID 47: Fecha válida (Hace 18 años)', () => {
      const hace18Anos = new Date();
      hace18Anos.setFullYear(hace18Anos.getFullYear() - 18);
      const fechaStr = hace18Anos.toISOString().split('T')[0];

      const p = new Personal('12345678', 'Juan', 'Perez', 2, null, null, undefined, null, fechaStr);
      expect(p.fecNac).toBe(fechaStr);
    });

    it('ID 48: Rechazar Fecha Futura ("Mañana")', () => {
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      const fechaStr = manana.toISOString().split('T')[0];

      expect(() => new Personal('12345678', 'Juan', 'Perez', 2, null, null, undefined, null, fechaStr)).toThrow(
        'La fecha no puede ser futura'
      );
    });

    it('ID 49: Rechazar Fecha > 80 años', () => {
      const hace81Anos = new Date();
      hace81Anos.setFullYear(hace81Anos.getFullYear() - 81);
      const fechaStr = hace81Anos.toISOString().split('T')[0];

      expect(() => new Personal('12345678', 'Juan', 'Perez', 2, null, null, undefined, null, fechaStr)).toThrow(
        'La fecha no puede ser mayor a 80 años'
      );
    });

    it('ID 50: Fecha válida (Hace 80 años)', () => {
      const hace80Anos = new Date();
      hace80Anos.setFullYear(hace80Anos.getFullYear() - 80);
      const fechaStr = hace80Anos.toISOString().split('T')[0];

      const p = new Personal('12345678', 'Juan', 'Perez', 2, null, null, undefined, null, fechaStr);
      expect(p.fecNac).toBe(fechaStr);
    });

    it('ID 51: Rechazar Fecha Inválida ("31/02/1995")', () => {
      expect(() => new Personal('12345678', 'Juan', 'Perez', 2, null, null, undefined, null, '1995-02-31')).toThrow(
        'Fecha inválida'
      );
    });
  });

  // =========================================================
  // BLOQUE 5: VALIDACIONES DE ROL Y ESPECIALIDAD (IDs 52 - 60)
  // =========================================================
  describe('Pruebas de Componente: Rol y Especialidad (IDs 52 - 60)', () => {
    it('ID 52: Rol Válido (1 - Médico)', () => {
      const p = new Personal('12345678', 'Juan', 'Perez', 1, '12345', 1);
      expect(p.idRol).toBe(1);
    });

    it('ID 53: Rol Válido (4 - Jefe de Hospital)', () => {
      const p = new Personal('12345678', 'Juan', 'Perez', 4);
      expect(p.idRol).toBe(4);
    });

    it('ID 54: Rechazar Rol Inválido (Rol = 0)', async () => {
      const dtoRolCero: RegistrarPersonalDTO = {
        dni: '87654321',
        username: 'user_rol_0',
        nombre: 'Carlos',
        apellidos: 'Gomez',
        idRol: 0,
      };
      await expect(service.ejecutar(dtoRolCero, ROL_JEFE_HOSPITAL)).rejects.toThrow('Rol inválido');
    });

    it('ID 55: Rechazar Rol Inválido (Rol = 5)', async () => {
      const dtoRolCinco: RegistrarPersonalDTO = {
        dni: '87654321',
        username: 'user_rol_5',
        nombre: 'Carlos',
        apellidos: 'Gomez',
        idRol: 5,
      };
      await expect(service.ejecutar(dtoRolCinco, ROL_JEFE_HOSPITAL)).rejects.toThrow('Rol inválido');
    });

    it('ID 56: Especialidad Válida (ID = 1)', () => {
      const p = new Personal('12345678', 'Juan', 'Perez', 1, '12345', 1);
      expect(p.idEspecialidad).toBe(1);
    });

    it('ID 57: Especialidad Válida (ID = 5)', () => {
      const p = new Personal('12345678', 'Juan', 'Perez', 1, '12345', 5);
      expect(p.idEspecialidad).toBe(5);
    });

    it('ID 58: Especialidad Vacía (si no es médico)', () => {
      const p = new Personal('12345678', 'Juan', 'Perez', 2);
      expect(p.idEspecialidad).toBeNull();
    });

    it('ID 59: Rechazar Especialidad Inválida (ID = 0)', () => {
      expect(() => new Personal('12345678', 'Juan', 'Perez', 1, '12345', 0)).toThrow(
        'Especialidad inválida'
      );
    });

    it('ID 60: Rechazar Especialidad Inválida (ID = 6)', () => {
      expect(() => new Personal('12345678', 'Juan', 'Perez', 1, '12345', 6)).toThrow(
        'Especialidad inválida'
      );
    });
  });

  // =========================================================
  // BLOQUE 6: VALIDACIONES DE COLEGIATURA (IDs 61 - 66)
  // =========================================================
  describe('Pruebas de Componente: Colegiatura (IDs 61 - 66)', () => {
    it('ID 61: Colegiatura Válida ("10000")', () => {
      const p = new Personal('12345678', 'Juan', 'Perez', 1, '10000', 1);
      expect(p.colegiatura).toBe('10000');
    });

    it('ID 62: Colegiatura Válida ("999999")', () => {
      const p = new Personal('12345678', 'Juan', 'Perez', 1, '999999', 1);
      expect(p.colegiatura).toBe('999999');
    });

    it('ID 63: Colegiatura Vacía (si no es médico)', () => {
      const p = new Personal('12345678', 'Juan', 'Perez', 2);
      expect(p.colegiatura).toBeNull();
    });

    it('ID 64: Rechazar Colegiatura < 5 dígitos ("9999")', () => {
      expect(() => new Personal('12345678', 'Juan', 'Perez', 1, '9999', 1)).toThrow(
        'La colegiatura debe tener entre 5 y 6 dígitos'
      );
    });

    it('ID 65: Rechazar Colegiatura > 6 dígitos ("1000000")', () => {
      expect(() => new Personal('12345678', 'Juan', 'Perez', 1, '1000000', 1)).toThrow(
        'La colegiatura debe tener entre 5 y 6 dígitos'
      );
    });

    it('ID 66: Rechazar Colegiatura con letras ("123A")', () => {
      expect(() => new Personal('12345678', 'Juan', 'Perez', 1, '123A', 1)).toThrow(
        'La colegiatura debe tener únicamente dígitos'
      );
    });
  });

  // =========================================================
  // BLOQUE 7: VALIDACIONES DE TELÉFONO (IDs 67 - 68)
  // =========================================================
  describe('Pruebas de Componente: Teléfono (IDs 67 - 68)', () => {
    it('ID 67: Teléfono registrado exitosamente ("912345678")', () => {
      const p = new Personal('12345678', 'Juan', 'Perez', 2, null, null, undefined, '912345678');
      expect(p.telefono).toBe('912345678');
    });

    it('ID 68: Rechazar teléfono con letras ("Abd12345")', () => {
      expect(() => new Personal('12345678', 'Juan', 'Perez', 2, null, null, undefined, 'Abd12345')).toThrow(
        'El número de teléfono debe tener 9 dígitos'
      );
    });
  });
});