import { CitaService } from '../../application/CitaService';
import { CitaRepository } from '../CitaRepository';
import { HorarioRepository } from '../../../registro-horario/domain/HorarioRepository';
import { PacienteRepository } from '../../../pacientes/domain/PacienteRepository';

describe('Pruebas Unitarias - Módulo Registro de Citas (Casos ID 79 al 90)', () => {
  let citaService: CitaService;
  let mockCitaRepo: jest.Mocked<CitaRepository>;
  let mockHorarioRepo: jest.Mocked<HorarioRepository>;
  let mockPacienteRepo: jest.Mocked<PacienteRepository>;

  const ROL_ADMINISTRATIVO = 2;

  const obtenerFechaRelativa = (dias: number): string => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().split('T')[0]!;
  };

  beforeEach(() => {
    mockCitaRepo = {
      crear: jest.fn().mockImplementation((c) => Promise.resolve(c)),
      listar: jest.fn().mockResolvedValue([]),
      obtenerPorId: jest.fn().mockResolvedValue(null),
      actualizar: jest.fn().mockResolvedValue(null),
      eliminar: jest.fn().mockResolvedValue(true),
    };

    mockHorarioRepo = {
      crear: jest.fn(),
      listar: jest.fn(),
      obtenerPorId: jest.fn().mockImplementation((id: number) => {
        if (id === 101) {
          return Promise.resolve({
            id: 101,
            dni: '44445555',
            fecha: obtenerFechaRelativa(-1), // Fecha pasada (Ayer)
            horaInicio: '08:00',
            horaFin: '08:30',
            turno: 'MAÑANA',
            estado: 'DISPONIBLE'
          } as any);
        }
        return Promise.resolve({
          id: 100,
          dni: '44445555',
          fecha: obtenerFechaRelativa(3),
          horaInicio: '08:00',
          horaFin: '08:30',
          turno: 'MAÑANA',
          estado: 'DISPONIBLE'
        } as any);
      }),
      actualizar: jest.fn().mockResolvedValue(null),
      eliminar: jest.fn(),
      buscarPorMedicoYFecha: jest.fn(),
    };

    mockPacienteRepo = {
      obtenerPorDni: jest.fn().mockImplementation((dni: string) => {
        if (dni === '12345678') {
          return Promise.resolve({ dni: '12345678', nombre: 'Juan Perez' });
        }
        return Promise.resolve(null);
      }),
      buscarPorDni: jest.fn().mockImplementation((dni: string) => {
        if (dni === '12345678') {
          return Promise.resolve({ dni: '12345678', nombre: 'Juan Perez' });
        }
        return Promise.resolve(null);
      }),
      guardar: jest.fn().mockResolvedValue(undefined),
      buscarCoincidenciasPorDni: jest.fn().mockResolvedValue([]),
      obtenerTodos: jest.fn().mockResolvedValue([]),
      eliminarPorDni: jest.fn().mockResolvedValue(true)
    } as any;

    citaService = new CitaService(mockCitaRepo, mockHorarioRepo, mockPacienteRepo);
  });

  describe('Componente: DNI Paciente (IDs 79 - 81)', () => {
    it('ID 79: Agendar cita con DNI de paciente válido', async () => {
      const dto = {
        dniPaciente: '12345678',
        dniMedico: '44445555',
        idEspecialidad: 1,
        idHorario: 100
      };

      const resultado = await citaService.crear(dto, ROL_ADMINISTRATIVO);
      expect(resultado).not.toBeNull();
      expect(resultado.dniPaciente).toBe('12345678');
    });

    it('ID 80: Rechazar cuando el paciente no está registrado', async () => {
      const dto = {
        dniPaciente: '00000000',
        dniMedico: '44445555',
        idEspecialidad: 1,
        idHorario: 100
      };

      await expect(citaService.crear(dto, ROL_ADMINISTRATIVO)).rejects.toThrow('Paciente no registrado');
    });

    it('ID 81: Rechazar DNI con formato inválido (Ej: 123457A)', async () => {
      const dto = {
        dniPaciente: '123457A',
        dniMedico: '44445555',
        idEspecialidad: 1,
        idHorario: 100
      };

      await expect(citaService.crear(dto, ROL_ADMINISTRATIVO)).rejects.toThrow('DNI con formato inválido');
    });
  });

  describe('Componente: Especialidad (IDs 82 - 83)', () => {
    it('ID 82: Permitir agendar con especialidad válida', async () => {
      const dto = {
        dniPaciente: '12345678',
        dniMedico: '44445555',
        idEspecialidad: 1,
        idHorario: 100
      };

      const resultado = await citaService.crear(dto, ROL_ADMINISTRATIVO);
      expect(resultado).not.toBeNull();
    });

    it('ID 83: Rechazar si se omite la especialidad', async () => {
      const dto = {
        dniPaciente: '12345678',
        dniMedico: '44445555',
        idEspecialidad: '',
        idHorario: 100
      };

      await expect(citaService.crear(dto, ROL_ADMINISTRATIVO)).rejects.toThrow('Debe seleccionar una especialidad');
    });
  });

  describe('Componente: Médico (IDs 84 - 85)', () => {
    it('ID 84: Permitir agendar con ID de médico registrada', async () => {
      const dto = {
        dniPaciente: '12345678',
        dniMedico: '44445555',
        idEspecialidad: 1,
        idHorario: 100
      };

      const resultado = await citaService.crear(dto, ROL_ADMINISTRATIVO);
      expect(resultado.idMedico).toBe('44445555');
    });

    it('ID 85: Rechazar si se omite el médico', async () => {
      const dto = {
        dniPaciente: '12345678',
        dniMedico: '',
        idEspecialidad: 1,
        idHorario: 100
      };

      await expect(citaService.crear(dto, ROL_ADMINISTRATIVO)).rejects.toThrow('Debe seleccionar un médico');
    });
  });

  describe('Componente: Fecha (IDs 86 - 87)', () => {
    it('ID 86: Agendar con fecha válida (Hoy + 3 días)', async () => {
      const dto = {
        dniPaciente: '12345678',
        dniMedico: '44445555',
        idEspecialidad: 1,
        idHorario: 100
      };

      const resultado = await citaService.crear(dto, ROL_ADMINISTRATIVO);
      expect(resultado).not.toBeNull();
    });

    it('ID 87: Rechazar selección de fecha pasada (Ayer)', async () => {
      const dto = {
        dniPaciente: '12345678',
        dniMedico: '44445555',
        idEspecialidad: 1,
        idHorario: 101
      };

      await expect(citaService.crear(dto, ROL_ADMINISTRATIVO)).rejects.toThrow('Fecha inválida');
    });
  });

  describe('Componente: Horario (IDs 88 - 90)', () => {
    it('ID 88: Agendar exitosamente en un slot libre', async () => {
      const dto = {
        dniPaciente: '12345678',
        dniMedico: '44445555',
        idEspecialidad: 1,
        idHorario: 100
      };

      const resultado = await citaService.crear(dto, ROL_ADMINISTRATIVO);
      expect(resultado).not.toBeNull();
      expect(mockHorarioRepo.actualizar).toHaveBeenCalledWith(100, { estado: 'OCUPADO' });
    });

    it('ID 89: Rechazar si el slot seleccionado está ocupado', async () => {
      mockHorarioRepo.obtenerPorId.mockResolvedValueOnce({
        id: 102,
        dni: '44445555',
        fecha: obtenerFechaRelativa(3),
        horaInicio: '08:00',
        horaFin: '08:30',
        turno: 'MAÑANA',
        estado: 'OCUPADO'
      } as any);

      const dto = {
        dniPaciente: '12345678',
        dniMedico: '44445555',
        idEspecialidad: 1,
        idHorario: 102
      };

      await expect(citaService.crear(dto, ROL_ADMINISTRATIVO)).rejects.toThrow('Horario inválido');
    });

    it('ID 90: Rechazar slot por intento de reserva simultánea (Estado cambia a ocupado)', async () => {
      mockHorarioRepo.obtenerPorId.mockResolvedValueOnce({
        id: 103,
        dni: '44445555',
        fecha: obtenerFechaRelativa(3),
        horaInicio: '08:00',
        horaFin: '08:30',
        turno: 'MAÑANA',
        estado: 'OCUPADO'
      } as any);

      const dto = {
        dniPaciente: '12345678',
        dniMedico: '44445555',
        idEspecialidad: 1,
        idHorario: 103
      };

      await expect(citaService.crear(dto, ROL_ADMINISTRATIVO)).rejects.toThrow('Horario inválido');
    });
  });
});