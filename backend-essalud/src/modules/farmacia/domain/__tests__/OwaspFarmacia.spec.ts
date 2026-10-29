import { FarmaciaService } from '../../application/FarmaciaService';
import { FarmaciaRepository } from '../../domain/FarmaciaRepository';

describe('Pruebas de Seguridad OWASP - Módulo Farmacia (A01: Broken Access Control - Código Real)', () => {
  let farmaciaService: FarmaciaService;
  let mockFarmaciaRepo: jest.Mocked<FarmaciaRepository>;

  beforeEach(() => {
    mockFarmaciaRepo = {
      listarInventario: jest.fn().mockResolvedValue([]),
      ingresarMedicamento: jest.fn(),
      listarRecetasPendientes: jest.fn(),
      despacharRecetaTransaccional: jest.fn(),
    } as any;

    farmaciaService = new FarmaciaService(mockFarmaciaRepo);
  });

  // ------------------------------------------------------------------------
  // OWASP A01: Broken Access Control (Control de Acceso por Roles)
  // ------------------------------------------------------------------------
  it('OWASP A01: Debe denegar el registro de un medicamento si el usuario ejecutante NO cuenta con el Rol de Farmacia (Rol 3)', async () => {
    const rolMedicoNoAutorizado = 1; // Rol Médico
    
    const dtoMedicamento = {
      nombreMedicamento: 'Ibuprofeno 400mg',
      composicion: 'Ibuprofeno sodico',
      cantidadIngreso: 100,
      stockMinimo: 20,
      fechaVencimiento: '2028-06-01',
    };

    await expect(
      farmaciaService.registrarMedicamento(dtoMedicamento, rolMedicoNoAutorizado)
    ).rejects.toThrow('Acceso denegado: Solo el personal de Farmacia (Rol 3) está autorizado para gestionar el inventario.');

    expect(mockFarmaciaRepo.ingresarMedicamento).not.toHaveBeenCalled();
  });

  it('OWASP A01: Debe denegar el despacho de recetas si el usuario NO cuenta con el Rol de Farmacia (Rol 3)', async () => {
    const rolMedicoNoAutorizado = 1;

    const dtoDespacho = {
      idOrden: 10,
      idMedicamento: 5,
      cantidadEntregada: 2,
    };

    await expect(
      farmaciaService.despacharReceta(dtoDespacho, rolMedicoNoAutorizado)
    ).rejects.toThrow();

    expect(mockFarmaciaRepo.despacharRecetaTransaccional).not.toHaveBeenCalled();
  });
});