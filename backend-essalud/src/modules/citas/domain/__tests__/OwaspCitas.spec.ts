import { CitaService } from '../../application/CitaService';
import { CitaRepository } from '../../domain/CitaRepository';
import { HorarioRepository } from '../../../registro-horario/domain/HorarioRepository';

describe('Pruebas de Seguridad OWASP - Módulo Citas (A04: Insecure Design - Concurrencia y Doble Reserva)', () => {
  let citaService: CitaService;
  let mockCitaRepo: jest.Mocked<CitaRepository>;
  let mockHorarioRepo: jest.Mocked<HorarioRepository>;

  const ROL_ADMINISTRATIVO = 2; 

  const obtenerFechaFutura = (): string => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 5);
    return fecha.toISOString().split('T')[0]!;
  };

  beforeEach(() => {
    mockCitaRepo = {
      crear: jest.fn().mockImplementation((c) => Promise.resolve(c)),
      listar: jest.fn().mockResolvedValue([]),
      obtenerPorId: jest.fn().mockResolvedValue(null),
      actualizar: jest.fn().mockResolvedValue(null),
      eliminar: jest.fn().mockResolvedValue(true),
    } as any;

    mockHorarioRepo = {
      crear: jest.fn(),
      listar: jest.fn(),
      obtenerPorId: jest.fn(),
      actualizar: jest.fn().mockResolvedValue(null),
      eliminar: jest.fn(),
      buscarPorMedicoYFecha: jest.fn(),
    } as any;

    const mockPacienteRepo = {
      obtenerPorDni: jest.fn().mockResolvedValue({ dni: '12345678', nombre: 'Juan Perez' }),
    } as any;

    citaService = new CitaService(mockCitaRepo, mockHorarioRepo, mockPacienteRepo);
  });

  it('OWASP A04: Debe prevenir la doble reserva o concurrencia rechazando un slot de horario que ya se encuentra OCUPADO', async () => {
    mockHorarioRepo.obtenerPorId.mockResolvedValueOnce({
      id: 500,
      dni: '44445555',
      fecha: obtenerFechaFutura(),
      horaInicio: '10:00',
      horaFin: '10:30',
      turno: 'MAÑANA',
      estado: 'OCUPADO',
    } as any);

    const dtoReserva = {
      dniPaciente: '12345678',
      dniMedico: '44445555',
      idEspecialidad: 1,
      idHorario: 500,
    };

    await expect(
      citaService.crear(dtoReserva, ROL_ADMINISTRATIVO)
    ).rejects.toThrow('Horario inválido');

    expect(mockCitaRepo.crear).not.toHaveBeenCalled();
    expect(mockHorarioRepo.actualizar).not.toHaveBeenCalled();
  });
});