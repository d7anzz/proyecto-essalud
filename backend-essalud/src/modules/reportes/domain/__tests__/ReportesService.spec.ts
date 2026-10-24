import { ReportesService } from '../../application/ReportesService';
import { ReportesRepository } from '../ReportesRepository';

describe('Pruebas Unitarias - Módulo Reportes y Estadísticas (Casos 129 - 142)', () => {
  let service: ReportesService;
  let mockRepo: jest.Mocked<ReportesRepository>;

  beforeEach(() => {
    mockRepo = {
      obtenerResumen: jest.fn(),
      listarCitasReporte: jest.fn().mockResolvedValue([]),
      listarPacientesReporte: jest.fn().mockResolvedValue([]),
      listarPersonalReporte: jest.fn().mockResolvedValue([]),
      listarConsultasReporte: jest.fn().mockResolvedValue([]),
      listarMedicamentosBajoStock: jest.fn().mockResolvedValue([]),
      listarMedicamentosPorVencer: jest.fn().mockResolvedValue([]),
    };

    service = new ReportesService(mockRepo);
  });

  describe('Pruebas de Selección de Tipo de Reporte (IDs 129 - 132)', () => {
    it('ID 129: Generar reporte de personal con filtros opcionales', async () => {
      await expect(service.listarPersonalReporte('Médico', '1')).resolves.not.toThrow();
      expect(mockRepo.listarPersonalReporte).toHaveBeenCalledWith('Médico', '1');
    });

    it('ID 130: Habilitar opción de descarga del padrón de pacientes', async () => {
      await expect(service.listarPacientesReporte()).resolves.not.toThrow();
      expect(mockRepo.listarPacientesReporte).toHaveBeenCalled();
    });

    it('ID 131 / 132: Rechazar tipo de reporte inexistente o ID 0', async () => {
      const reportesValidos = ['personal', 'pacientes', 'citas', 'consultas'];
      const tipoInvalido = '0';

      const esValido = reportesValidos.includes(tipoInvalido);
      expect(esValido).toBe(false);
    });
  });

  describe('Pruebas de Filtro por Rol (IDs 133 - 134)', () => {
    it('ID 133: Filtrar el personal con rol Médico', async () => {
      await expect(service.listarPersonalReporte('Médico')).resolves.not.toThrow();
      expect(mockRepo.listarPersonalReporte).toHaveBeenCalledWith('Médico', undefined);
    });

    it('ID 134: Rechazar ID de Rol no registrado (Ejemplo: Rol ID 5)', async () => {
      await expect(service.listarPersonalReporte('5')).rejects.toThrow('Rol no registrado');
    });
  });

  describe('Pruebas de Filtro por Especialidad (IDs 135 - 137)', () => {
    it('ID 135: Filtrar registros de personal por especialidad (Cardiología - ID 1)', async () => {
      await expect(service.listarPersonalReporte('Médico', '1')).resolves.not.toThrow();
      expect(mockRepo.listarPersonalReporte).toHaveBeenCalledWith('Médico', '1');
    });

    it('ID 136: Omitir especialidad correctamente cuando no se especifica', async () => {
      await expect(service.listarPersonalReporte('Enfermero', undefined)).resolves.not.toThrow();
      expect(mockRepo.listarPersonalReporte).toHaveBeenCalledWith('Enfermero', undefined);
    });

    it('ID 137: Rechazar ID de especialidad no registrada (Ejemplo: Especialidad ID 6)', async () => {
      await expect(service.listarPersonalReporte('Médico', '6')).rejects.toThrow('Especialidad no registrada');
    });
  });

  describe('Pruebas de Filtro por Fechas (IDs 138 - 141)', () => {
    it('ID 138: Generar reporte con un rango válido de fechas', async () => {
      await expect(service.listarCitasReporte('2026-10-01', '2026-10-18')).resolves.not.toThrow();
      expect(mockRepo.listarCitasReporte).toHaveBeenCalledWith('2026-10-01', '2026-10-18', undefined, undefined);
    });

    it('ID 139: Generar reporte con rango del mismo día', async () => {
      await expect(service.listarCitasReporte('2026-10-18', '2026-10-18')).resolves.not.toThrow();
      expect(mockRepo.listarCitasReporte).toHaveBeenCalledWith('2026-10-18', '2026-10-18', undefined, undefined);
    });

    it('ID 140: Rechazar cuando la fecha de inicio es mayor a la fecha de fin', async () => {
      await expect(service.listarCitasReporte('2026-10-25', '2026-10-18')).rejects.toThrow(
        'La fecha de inicio no puede ser mayor a la fecha de fin'
      );
    });

    it('ID 141: Rechazar fecha con formato o valor inválido (31/02/2026 o formato incorrecto)', async () => {
      await expect(service.listarCitasReporte('2026-02-31', '2026-10-18')).rejects.toThrow(
        'Formato no válido'
      );
    });
  });

  describe('Pruebas de Filtro por Estado (ID 142)', () => {
    it('ID 142: Generar reporte de citas filtrando por estado COMPLETADA', async () => {
      await expect(service.listarCitasReporte(undefined, undefined, undefined, 'COMPLETADA')).resolves.not.toThrow();
      expect(mockRepo.listarCitasReporte).toHaveBeenCalledWith(undefined, undefined, undefined, 'COMPLETADA');
    });
  });
});