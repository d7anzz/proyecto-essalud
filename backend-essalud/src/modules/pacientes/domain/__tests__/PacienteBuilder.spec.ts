import { PacienteBuilder } from '../PacienteBuilder';

describe('Pruebas Unitarias: Registro de Pacientes (Casos 1 al 29)', () => {

  // ==========================================
  // DNI (Casos 1 al 6)
  // ==========================================
  describe('Pruebas de DNI', () => {
    it('ID 1: DNI válido (12345678)', () => {
      const builder = new PacienteBuilder().setDni('12345678');
      expect(builder['_dni']).toBe('12345678');
    });

    it('ID 2: DNI con más de 8 dígitos (100000000)', () => {
      expect(() => {
        new PacienteBuilder().setDni('100000000');
      }).toThrow('El DNI debe contener exactamente 8 dígitos numéricos.');
    });

    it('ID 3: DNI con menos de 8 dígitos (9999999)', () => {
      expect(() => {
        new PacienteBuilder().setDni('9999999');
      }).toThrow('El DNI debe contener exactamente 8 dígitos numéricos.');
    });

    it('ID 4: DNI con letras (1234A567)', () => {
      expect(() => {
        new PacienteBuilder().setDni('1234A567');
      }).toThrow('El DNI debe contener exactamente 8 dígitos numéricos.');
    });

    it('ID 5: DNI con espacios (1234 5678)', () => {
      expect(() => {
        new PacienteBuilder().setDni('1234 5678');
      }).toThrow('El DNI debe contener exactamente 8 dígitos numéricos.');
    });

    it('ID 6: DNI con número negativo (-12345678)', () => {
      expect(() => {
        new PacienteBuilder().setDni('-12345678');
      }).toThrow('El DNI debe contener exactamente 8 dígitos numéricos.');
    });
  });

  // ==========================================
  // NOMBRE (Casos 7 al 12)
  // ==========================================
  describe('Pruebas de Nombre', () => {
    it('ID 7: Nombre válido (Juan)', () => {
      const builder = new PacienteBuilder().setNombre('Juan');
      expect(builder['_nombre']).toBe('Juan');
    });

    it('ID 8: Nombre de más de 50 caracteres', () => {
      const cadena51 = 'A'.repeat(51);
      expect(() => {
        new PacienteBuilder().setNombre(cadena51);
      }).toThrow('El nombre debe tener entre 3 y 50 caracteres.');
    });

    it('ID 9: Nombre de menos de 3 caracteres (Jo)', () => {
      expect(() => {
        new PacienteBuilder().setNombre('Jo');
      }).toThrow('El nombre debe tener entre 3 y 50 caracteres.');
    });

    it('ID 10: Nombre vacío (" ")', () => {
      expect(() => {
        new PacienteBuilder().setNombre(' ');
      }).toThrow('El nombre del paciente no puede estar vacío.');
    });

    it('ID 11: Nombre con números (Juan123)', () => {
      expect(() => {
        new PacienteBuilder().setNombre('Juan123');
      }).toThrow('El nombre debe contener únicamente letras.');
    });

    it('ID 12: Nombre con caracteres especiales (Juan@)', () => {
      expect(() => {
        new PacienteBuilder().setNombre('Juan@');
      }).toThrow('El nombre debe contener únicamente letras.');
    });
  });

  // ==========================================
  // APELLIDO (Casos 13 al 16)
  // ==========================================
  describe('Pruebas de Apellido', () => {
    it('ID 13: Apellido de más de 50 caracteres', () => {
      const cadena51 = 'A'.repeat(51);
      expect(() => {
        new PacienteBuilder().setApellidos(cadena51);
      }).toThrow('El apellido debe tener entre 3 y 50 caracteres.');
    });

    it('ID 14: Apellido de menos de 3 caracteres (Aa)', () => {
      expect(() => {
        new PacienteBuilder().setApellidos('Aa');
      }).toThrow('El apellido debe tener entre 3 y 50 caracteres.');
    });

    it('ID 15: Apellido válido (Pérez)', () => {
      const builder = new PacienteBuilder().setApellidos('Pérez');
      expect(builder['_apellidos']).toBe('Pérez');
    });

    it('ID 16: Apellido con caracteres inválidos (Perez_2)', () => {
      expect(() => {
        new PacienteBuilder().setApellidos('Perez_2');
      }).toThrow('El apellido debe contener únicamente letras.');
    });
  });

  // ==========================================
  // FECHA DE NACIMIENTO (Casos 17 al 22)
  // ==========================================
  describe('Pruebas de Fecha de Nacimiento', () => {
    it('ID 17: Fecha válida (15/05/1995)', () => {
      const builder = new PacienteBuilder().setFechaNacimiento('1995-05-15');
      expect(builder['_fechaNacimiento']).toBeDefined();
    });

    it('ID 18: Fecha de hoy', () => {
      const hoy = new Date().toISOString().split('T')[0]!;
      const builder = new PacienteBuilder().setFechaNacimiento(hoy);
      expect(builder['_fechaNacimiento']).toBeDefined();
    });

    it('ID 19: Fecha futura (Mañana)', () => {
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      expect(() => {
        new PacienteBuilder().setFechaNacimiento(manana);
      }).toThrow('La fecha no puede ser futura.');
    });

    it('ID 20: Fecha mayor a 120 años (Hace 121 años)', () => {
      const hace121 = new Date();
      hace121.setFullYear(hace121.getFullYear() - 121);
      expect(() => {
        new PacienteBuilder().setFechaNacimiento(hace121);
      }).toThrow('La fecha no puede ser mayor a 120 años.');
    });

    it('ID 21: Fecha límite válida (Hace 120 años)', () => {
      const hace120 = new Date();
      hace120.setFullYear(hace120.getFullYear() - 120);
      const builder = new PacienteBuilder().setFechaNacimiento(hace120);
      expect(builder['_fechaNacimiento']).toBeDefined();
    });

    it('ID 22: Fecha inválida (31/02/1995)', () => {
      expect(() => {
        new PacienteBuilder().setFechaNacimiento('1995-02-31');
      }).toThrow('La fecha de nacimiento proporcionada no tiene un formato válido.');
    });
  });

  // ==========================================
  // SEXO (Casos 23 al 25)
  // ==========================================
  describe('Pruebas de Sexo', () => {
    it('ID 23: Sexo válido (M)', () => {
      const builder = new PacienteBuilder().setSexo('M');
      expect(builder['_sexo']).toBe('M');
    });

    it('ID 24: Sexo inválido (X)', () => {
      expect(() => {
        new PacienteBuilder().setSexo('X');
      }).toThrow('Debe ingresar M o F.');
    });

    it('ID 25: Sexo vacío', () => {
      expect(() => {
        new PacienteBuilder().setSexo(' ');
      }).toThrow('El campo es obligatorio.');
    });
  });

  // ==========================================
  // TELÉFONO (Casos 26 y 27)
  // ==========================================
  describe('Pruebas de Teléfono', () => {
    it('ID 26: Teléfono válido de 9 dígitos (987654321)', () => {
      const builder = new PacienteBuilder().setTelefono('987654321');
      expect(builder['_telefono']).toBe('987654321');
    });

    it('ID 27: Teléfono con letras (98765432A)', () => {
      expect(() => {
        new PacienteBuilder().setTelefono('98765432A');
      }).toThrow('El teléfono solo debe contener números y tener exactamente 9 dígitos.');
    });
  });

  // ==========================================
  // TIPO SEGURO (Caso 28)
  // ==========================================
  describe('Pruebas de Tipo de Seguro', () => {
    it('ID 28: Tipo de seguro válido (TITULAR)', () => {
      const builder = new PacienteBuilder().setTipoSeguro('TITULAR');
      expect(builder['_tipoSeguro']).toBe('TITULAR');
    });
  });

  // ==========================================
  // GRUPO SANGUÍNEO (Caso 29)
  // ==========================================
  describe('Pruebas de Grupo Sanguíneo', () => {
    it('ID 29: Grupo sanguíneo válido (O+)', () => {
      const builder = new PacienteBuilder().setGrupoSanguineo('O+');
      expect(builder['_grupoSanguineo']).toBe('O+');
    });
  });
});