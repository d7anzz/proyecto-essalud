import { HorarioService } from '../../application/HorarioService';
import { HorarioRepository } from '../HorarioRepository';
import { CrearHorarioDTO } from '../../application/CrearHorarioDTO';

describe('Pruebas Unitarias - Módulo Registro de Horario (Casos ID 69 al 78)', () => {
  let horarioService: HorarioService;
  let mockRepository: jest.Mocked<HorarioRepository>;

  const ROL_MEDICO = 1;

  const obtenerFechaRelativa = (dias: number): string => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().split('T')[0]!;
  };

  beforeEach(() => {
    mockRepository = {
      crear: jest.fn().mockImplementation((h) => Promise.resolve(h)),
      listar: jest.fn().mockResolvedValue([]),
      obtenerPorId: jest.fn().mockResolvedValue(null),
      actualizar: jest.fn().mockResolvedValue(null),
      eliminar: jest.fn().mockResolvedValue(true),
      buscarPorMedicoYFecha: jest.fn().mockResolvedValue([]),
    };

    horarioService = new HorarioService(mockRepository);
  });

  describe('Pruebas de Componente: Fecha (IDs 69 - 72)', () => {
    it('ID 69: Registrar con fecha válida (Hoy + 4 días)', async () => {
      const fechaValida = obtenerFechaRelativa(4);
      const dto: CrearHorarioDTO = {
        dni: '12345678',
        fecha: fechaValida,
        turno: 'MAÑANA',
        horaInicio: '07:00',
        cantidadPacientes: 10
      };

      const resultado = await horarioService.crear(dto, ROL_MEDICO);
      expect(resultado.fecha).toBe(fechaValida);
    });

    it('ID 70: Registrar con fecha válida límite (Hoy + 3 días)', async () => {
      const fechaValida = obtenerFechaRelativa(3);
      const dto: CrearHorarioDTO = {
        dni: '12345678',
        fecha: fechaValida,
        turno: 'MAÑANA',
        horaInicio: '07:00',
        cantidadPacientes: 10
      };

      const resultado = await horarioService.crear(dto, ROL_MEDICO);
      expect(resultado.fecha).toBe(fechaValida);
    });

    it('ID 71: Rechazar fecha menor a 3 días de antelación (Hoy + 1 día)', async () => {
      const fechaInvalida = obtenerFechaRelativa(1);
      const dto: CrearHorarioDTO = {
        dni: '12345678',
        fecha: fechaInvalida,
        turno: 'MAÑANA',
        horaInicio: '07:00',
        cantidadPacientes: 10
      };

      await expect(horarioService.crear(dto, ROL_MEDICO)).rejects.toThrow('Fecha inválida');
    });

    it('ID 72: Rechazar fecha pasada (Ayer)', async () => {
      const ayer = obtenerFechaRelativa(-1);
      const dto: CrearHorarioDTO = {
        dni: '12345678',
        fecha: ayer,
        turno: 'MAÑANA',
        horaInicio: '07:00',
        cantidadPacientes: 10
      };

      await expect(horarioService.crear(dto, ROL_MEDICO)).rejects.toThrow('Fecha inválida');
    });
  });

  describe('Pruebas de Componente: Turno (IDs 73 - 74)', () => {
    it('ID 73: Registrar con turno válido ("MAÑANA")', async () => {
      const fechaValida = obtenerFechaRelativa(4);
      const dto: CrearHorarioDTO = {
        dni: '12345678',
        fecha: fechaValida,
        turno: 'MAÑANA',
        horaInicio: '07:00',
        cantidadPacientes: 10
      };

      const resultado = await horarioService.crear(dto, ROL_MEDICO);
      expect(resultado.turno).toBe('MAÑANA');
    });

    it('ID 74: Rechazar turno no seleccionado o vacío', async () => {
      const fechaValida = obtenerFechaRelativa(4);
      const dto: CrearHorarioDTO = {
        dni: '12345678',
        fecha: fechaValida,
        turno: '' as any,
        horaInicio: '07:00',
        cantidadPacientes: 10
      };

      await expect(horarioService.crear(dto, ROL_MEDICO)).rejects.toThrow('El campo no puede estar vacío');
    });
  });

  describe('Pruebas de Componente: Hora Inicio / Fin (IDs 75 - 78)', () => {
    it('ID 75: Horario registrado exitosamente en turno Mañana', async () => {
      const fechaValida = obtenerFechaRelativa(4);
      const dto: CrearHorarioDTO = {
        dni: '12345678',
        fecha: fechaValida,
        turno: 'MAÑANA',
        horaInicio: '07:00',
        cantidadPacientes: 10
      };

      const resultado = await horarioService.crear(dto, ROL_MEDICO);
      expect(resultado).not.toBeNull();
      expect(resultado.dni).toBe('12345678');
    });

    it('ID 76: Rechazar si excede la capacidad máxima del turno (Exceso de pacientes)', async () => {
      const fechaValida = obtenerFechaRelativa(4);
      const dto: CrearHorarioDTO = {
        dni: '12345678',
        fecha: fechaValida,
        turno: 'TARDE',
        horaInicio: '13:00',
        cantidadPacientes: 25
      };

      await expect(horarioService.crear(dto, ROL_MEDICO)).rejects.toThrow('Exceso de Capacidad');
    });

    it('ID 77: Rechazar hora que excede límite del turno Mañana', async () => {
      const fechaValida = obtenerFechaRelativa(4);
      const dto: CrearHorarioDTO = {
        dni: '12345678',
        fecha: fechaValida,
        turno: 'MAÑANA',
        horaInicio: '08:00',
        cantidadPacientes: 15
      };

      await expect(horarioService.crear(dto, ROL_MEDICO)).rejects.toThrow('Exceso de Capacidad');
    });

    it('ID 78: Rechazar hora que excede límite del turno Tarde', async () => {
      const fechaValida = obtenerFechaRelativa(4);
      const dto: CrearHorarioDTO = {
        dni: '12345678',
        fecha: fechaValida,
        turno: 'TARDE',
        horaInicio: '13:00',
        cantidadPacientes: 20
      };

      await expect(horarioService.crear(dto, ROL_MEDICO)).rejects.toThrow('Exceso de Capacidad');
    });
  });
});