import { FarmaciaService } from '../../application/FarmaciaService';
import { FarmaciaRepository } from '../FarmaciaRepository';
import { DespacharRecetaDTO } from '../../application/DespacharRecetaDTO';

describe('Pruebas Unitarias - Módulo Despacho de Farmacia (Casos 122 - 128)', () => {
  let service: FarmaciaService;
  let mockRepo: jest.Mocked<FarmaciaRepository>;

  const ROL_FARMACEUTICO = 3;

  beforeEach(() => {
    mockRepo = {
      listarInventario: jest.fn(),
      ingresarMedicamento: jest.fn(),
      listarRecetasPendientes: jest.fn(),
      despacharRecetaTransaccional: jest.fn().mockResolvedValue(undefined),
    };

    service = new FarmaciaService(mockRepo);
  });

  describe('Pruebas de Estado de Orden (IDs 122 - 123)', () => {
    it('ID 122: Orden válida para entrega en estado PENDIENTE', async () => {
      const dto: DespacharRecetaDTO = {
        idOrden: 1,
        idMedicamento: 10,
        cantidadEntregada: 5,
      };

      await expect(service.despacharReceta(dto, ROL_FARMACEUTICO)).resolves.not.toThrow();
      expect(mockRepo.despacharRecetaTransaccional).toHaveBeenCalledWith(1, 10, 5);
    });

    it('ID 123: Rechazar despacho si la orden ya fue atendida/despachada anteriormente', async () => {
      mockRepo.despacharRecetaTransaccional.mockRejectedValueOnce(
        new Error('La orden ya fue despachada anteriormente')
      );

      const dto: DespacharRecetaDTO = {
        idOrden: 2,
        idMedicamento: 10,
        cantidadEntregada: 5,
      };

      await expect(service.despacharReceta(dto, ROL_FARMACEUTICO)).rejects.toThrow(
        'La orden ya fue despachada anteriormente'
      );
    });
  });

  describe('Pruebas de Cantidad y Stock en Despacho (IDs 124 - 128)', () => {
    it('ID 124: Despacho exitoso con stock suficiente (Recetado: 5, Stock: 20)', async () => {
      const dto: DespacharRecetaDTO = {
        idOrden: 1,
        idMedicamento: 10,
        cantidadEntregada: 5,
      };

      await expect(service.despacharReceta(dto, ROL_FARMACEUTICO)).resolves.not.toThrow();
      expect(mockRepo.despacharRecetaTransaccional).toHaveBeenCalledWith(1, 10, 5);
    });

    it('ID 125: Despacho exitoso que agota el stock a límite crítico (Recetado: 10, Stock: 10)', async () => {
      const dto: DespacharRecetaDTO = {
        idOrden: 1,
        idMedicamento: 10,
        cantidadEntregada: 10,
      };

      await expect(service.despacharReceta(dto, ROL_FARMACEUTICO)).resolves.not.toThrow();
      expect(mockRepo.despacharRecetaTransaccional).toHaveBeenCalledWith(1, 10, 10);
    });

    it('ID 126: Rechazar despacho por stock insuficiente (Recetado: 10, Stock: 3)', async () => {
      mockRepo.despacharRecetaTransaccional.mockRejectedValueOnce(
        new Error('Stock insuficiente para completar la entrega')
      );

      const dto: DespacharRecetaDTO = {
        idOrden: 1,
        idMedicamento: 10,
        cantidadEntregada: 10,
      };

      await expect(service.despacharReceta(dto, ROL_FARMACEUTICO)).rejects.toThrow(
        'Stock insuficiente para completar la entrega'
      );
    });

    it('ID 127: Rechazar cantidad a entregar igual a 0', async () => {
      const dto: DespacharRecetaDTO = {
        idOrden: 1,
        idMedicamento: 10,
        cantidadEntregada: 0,
      };

      await expect(service.despacharReceta(dto, ROL_FARMACEUTICO)).rejects.toThrow(
        'La cantidad debe ser mayor a 0'
      );
    });

    it('ID 128: Rechazar cantidad a entregar negativa (-2)', async () => {
      const dto: DespacharRecetaDTO = {
        idOrden: 1,
        idMedicamento: 10,
        cantidadEntregada: -2,
      };

      await expect(service.despacharReceta(dto, ROL_FARMACEUTICO)).rejects.toThrow(
        'La cantidad debe ser mayor a 0'
      );
    });
  });
});