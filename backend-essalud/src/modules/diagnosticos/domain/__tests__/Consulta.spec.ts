import { Consulta } from '../../domain/Consulta';
import { ConsultaService } from '../../application/ConsultaService';
import { ConsultaRepository } from '../../domain/ConsultaRepository';
import { CrearConsultaDTO } from '../../application/CrearConsultaDTO';

describe('Pruebas Unitarias - Módulo Consulta Médica (Casos ID 91 al 105)', () => {
  let service: ConsultaService;
  let mockConsultaRepo: jest.Mocked<ConsultaRepository>;

  const ROL_MEDICO = 1;
  const ROL_ADMINISTRATIVO = 2;

  beforeEach(() => {
    mockConsultaRepo = {
      crearTransaccional: jest.fn().mockResolvedValue(undefined),
    };

    service = new ConsultaService(mockConsultaRepo);
  });

  // =========================================================
  // BLOQUE 1: VALIDACIONES DE ROL Y CITA (IDs 91 - 92)
  // =========================================================
  describe('Pruebas de Componente: Estado y Rol de Cita (IDs 91 - 92)', () => {
    it('ID 91: Permitir registro cuando el ejecutor es Médico (Rol 1)', async () => {
      const dto: CrearConsultaDTO = {
        idCita: 100,
        dniPaciente: '12345678',
        idMedico: '87654321',
        diagnostico: 'Paciente presenta cuadro febril',
        observaciones: 'Reposo',
      };

      await expect(service.crearConsultaMedica(dto, ROL_MEDICO)).resolves.not.toThrow();
      expect(mockConsultaRepo.crearTransaccional).toHaveBeenCalled();
    });

    it('ID 92: Rechazar atención si el rol no es Médico (Ej: Administrativo Rol 2)', async () => {
      const dto: CrearConsultaDTO = {
        idCita: 101,
        dniPaciente: '12345678',
        idMedico: '87654321',
        diagnostico: 'Paciente presenta cuadro febril',
        observaciones: '',
      };

      await expect(service.crearConsultaMedica(dto, ROL_ADMINISTRATIVO)).rejects.toThrow(
        'Acceso denegado: Solo el personal Médico (Rol 1) está autorizado para emitir diagnósticos y recetas.'
      );
    });
  });

  // =========================================================
  // BLOQUE 2: VALIDACIONES DE DIAGNÓSTICO (IDs 93 - 96)
  // =========================================================
  describe('Pruebas de Componente: Diagnóstico (IDs 93 - 96)', () => {
    it('ID 93: Registrar con Diagnóstico válido ("Paciente presenta...")', async () => {
      const dto: CrearConsultaDTO = {
        idCita: 100,
        dniPaciente: '12345678',
        idMedico: '87654321',
        diagnostico: 'Paciente presenta cuadro febril',
        observaciones: '',
      };

      await service.crearConsultaMedica(dto, ROL_MEDICO);
      expect(mockConsultaRepo.crearTransaccional).toHaveBeenCalledWith(
        expect.objectContaining({ diagnostico: 'Paciente presenta cuadro febril' }),
        []
      );
    });

    it('ID 94: Rechazar Diagnóstico < 5 caracteres ("grip")', async () => {
      const dto: CrearConsultaDTO = {
        idCita: 100,
        dniPaciente: '12345678',
        idMedico: '87654321',
        diagnostico: 'grip',
        observaciones: '',
      };

      await expect(service.crearConsultaMedica(dto, ROL_MEDICO)).rejects.toThrow(
        'El diagnóstico debe tener entre 5 y 1000 caracteres'
      );
    });

    it('ID 95: Rechazar Diagnóstico > 1000 caracteres', async () => {
      const dto: CrearConsultaDTO = {
        idCita: 100,
        dniPaciente: '12345678',
        idMedico: '87654321',
        diagnostico: 'A'.repeat(1001),
        observaciones: '',
      };

      await expect(service.crearConsultaMedica(dto, ROL_MEDICO)).rejects.toThrow(
        'El diagnóstico debe tener entre 5 y 1000 caracteres'
      );
    });

    it('ID 96: Rechazar Diagnóstico vacío', async () => {
      const dto: CrearConsultaDTO = {
        idCita: 100,
        dniPaciente: '12345678',
        idMedico: '87654321',
        diagnostico: '',
        observaciones: '',
      };

      await expect(service.crearConsultaMedica(dto, ROL_MEDICO)).rejects.toThrow(
        'El diagnóstico debe tener entre 5 y 1000 caracteres'
      );
    });
  });

  // =========================================================
  // BLOQUE 3: VALIDACIONES DE OBSERVACIONES (IDs 97 - 98)
  // =========================================================
  describe('Pruebas de Componente: Observaciones (IDs 97 - 98)', () => {
    it('ID 97: Registrar Observaciones válidas', async () => {
      const obs = 'Reposo por 48 horas e hidratación';
      const dto: CrearConsultaDTO = {
        idCita: 100,
        dniPaciente: '12345678',
        idMedico: '87654321',
        diagnostico: 'Fiebre alta',
        observaciones: obs,
      };

      await service.crearConsultaMedica(dto, ROL_MEDICO);
      expect(mockConsultaRepo.crearTransaccional).toHaveBeenCalledWith(
        expect.objectContaining({ observaciones: obs }),
        []
      );
    });

    it('ID 98: Permitir Observaciones vacías', async () => {
      const dto: CrearConsultaDTO = {
        idCita: 100,
        dniPaciente: '12345678',
        idMedico: '87654321',
        diagnostico: 'Fiebre alta',
        observaciones: '',
      };

      await service.crearConsultaMedica(dto, ROL_MEDICO);
      expect(mockConsultaRepo.crearTransaccional).toHaveBeenCalledWith(
        expect.objectContaining({ observaciones: '' }),
        []
      );
    });
  });

  // =========================================================
  // BLOQUE 4: VALIDACIONES DE MEDICAMENTO Y CANTIDAD (IDs 99 - 105)
  // =========================================================
  describe('Pruebas de Componente: Prescripción (IDs 99 - 105)', () => {
    it('ID 99: Medicamento válido con ID registrado', async () => {
      const dto: CrearConsultaDTO = {
        idCita: 100,
        dniPaciente: '12345678',
        idMedico: '87654321',
        diagnostico: 'Fiebre alta persistente',
        observaciones: '',
        medicamentos: [{ idMedicamento: 1, cantidadRecetada: 10 }],
      };

      await service.crearConsultaMedica(dto, ROL_MEDICO);
      expect(mockConsultaRepo.crearTransaccional).toHaveBeenCalledWith(
        expect.anything(),
        [{ idMedicamento: 1, cantidadRecetada: 10 }]
      );
    });

    it('ID 100: Medicamento vacío es válido (sin arreglo o array vacío)', async () => {
      const dto: CrearConsultaDTO = {
        idCita: 100,
        dniPaciente: '12345678',
        idMedico: '87654321',
        diagnostico: 'Fiebre alta persistente',
        observaciones: '',
        medicamentos: [],
      };

      await service.crearConsultaMedica(dto, ROL_MEDICO);
      expect(mockConsultaRepo.crearTransaccional).toHaveBeenCalledWith(
        expect.anything(),
        []
      );
    });

    it('ID 101: Cantidad válida (1)', async () => {
      const dto: CrearConsultaDTO = {
        idCita: 100,
        dniPaciente: '12345678',
        idMedico: '87654321',
        diagnostico: 'Infección leve',
        observaciones: '',
        medicamentos: [{ idMedicamento: 1, cantidadRecetada: 1 }],
      };

      await service.crearConsultaMedica(dto, ROL_MEDICO);
      expect(mockConsultaRepo.crearTransaccional).toHaveBeenCalledWith(
        expect.anything(),
        [{ idMedicamento: 1, cantidadRecetada: 1 }]
      );
    });

    it('ID 102: Cantidad válida (100)', async () => {
      const dto: CrearConsultaDTO = {
        idCita: 100,
        dniPaciente: '12345678',
        idMedico: '87654321',
        diagnostico: 'Tratamiento prolongado',
        observaciones: '',
        medicamentos: [{ idMedicamento: 1, cantidadRecetada: 100 }],
      };

      await service.crearConsultaMedica(dto, ROL_MEDICO);
      expect(mockConsultaRepo.crearTransaccional).toHaveBeenCalledWith(
        expect.anything(),
        [{ idMedicamento: 1, cantidadRecetada: 100 }]
      );
    });

    it('ID 103: Rechazar cantidad límite superior (101)', async () => {
      const dto: CrearConsultaDTO = {
        idCita: 100,
        dniPaciente: '12345678',
        idMedico: '87654321',
        diagnostico: 'Tratamiento masivo',
        observaciones: '',
        medicamentos: [{ idMedicamento: 1, cantidadRecetada: 101 }],
      };

      await expect(service.crearConsultaMedica(dto, ROL_MEDICO)).rejects.toThrow(
        'El máximo recetable es de 100 unidades'
      );
    });

    it('ID 104: Cantidad 0 es válida (sin prescripción)', async () => {
      const dto: CrearConsultaDTO = {
        idCita: 100,
        dniPaciente: '12345678',
        idMedico: '87654321',
        diagnostico: 'Chequeo general sin medicación',
        observaciones: '',
        medicamentos: [{ idMedicamento: 1, cantidadRecetada: 0 }],
      };

      await service.crearConsultaMedica(dto, ROL_MEDICO);
      expect(mockConsultaRepo.crearTransaccional).toHaveBeenCalledWith(
        expect.anything(),
        [{ idMedicamento: 1, cantidadRecetada: 0 }]
      );
    });

    it('ID 105: Rechazar cantidad negativa (-1)', async () => {
      const dto: CrearConsultaDTO = {
        idCita: 100,
        dniPaciente: '12345678',
        idMedico: '87654321',
        diagnostico: 'Cuadro alérgico',
        observaciones: '',
        medicamentos: [{ idMedicamento: 1, cantidadRecetada: -1 }],
      };

      await expect(service.crearConsultaMedica(dto, ROL_MEDICO)).rejects.toThrow(
        'La cantidad debe ser mayor o igual a 0'
      );
    });
  });
});