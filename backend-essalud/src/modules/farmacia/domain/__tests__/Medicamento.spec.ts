import { Medicamento } from '../Medicamento';

describe('Pruebas Unitarias - Módulo Medicamentos (Casos 106 - 121)', () => {
  const FECHA_VALIDA = '2028-01-01'; // Una fecha segura en el futuro

  describe('Pruebas de Componente: Nombre', () => {
    it('ID 106: Nombre válido', () => {
      const m = new Medicamento(1, 'Paracetamol 500mg', 'Paracetamol trihidrato', 50, 10, FECHA_VALIDA);
      expect(m.nombreMedicamento).toBe('Paracetamol 500mg');
    });

    it('ID 107: Rechazar Nombre < 3 caracteres', () => {
      expect(() => new Medicamento(1, 'Pa', 'Paracetamol trihidrato', 50, 10, FECHA_VALIDA))
        .toThrow('El nombre debe tener entre 3 y 100 caracteres');
    });

    it('ID 108: Rechazar Nombre > 100 caracteres', () => {
      expect(() => new Medicamento(1, 'A'.repeat(101), 'Paracetamol trihidrato', 50, 10, FECHA_VALIDA))
        .toThrow('El nombre debe tener entre 3 y 100 caracteres');
    });

    it('ID 109: Rechazar Nombre vacío', () => {
      expect(() => new Medicamento(1, '', 'Paracetamol trihidrato', 50, 10, FECHA_VALIDA))
        .toThrow('El campo es obligatorio');
    });
  });

  describe('Pruebas de Componente: Composición', () => {
    it('ID 110: Composición válida', () => {
      const m = new Medicamento(1, 'Paracetamol', 'Paracetamol trihidrato 500mg', 50, 10, FECHA_VALIDA);
      expect(m.composicion).toBe('Paracetamol trihidrato 500mg');
    });

    it('ID 111: Rechazar Composición < 3 caracteres', () => {
      expect(() => new Medicamento(1, 'Paracetamol', 'Pa', 50, 10, FECHA_VALIDA))
        .toThrow('La composición debe tener entre 3 y 150 caracteres');
    });

    it('ID 112: Rechazar Composición > 150 caracteres', () => {
      expect(() => new Medicamento(1, 'Paracetamol', 'B'.repeat(151), 50, 10, FECHA_VALIDA))
        .toThrow('La composición debe tener entre 3 y 150 caracteres');
    });

    it('ID 113: Rechazar Composición vacía', () => {
      expect(() => new Medicamento(1, 'Paracetamol', '', 50, 10, FECHA_VALIDA))
        .toThrow('El campo es obligatorio');
    });
  });

  describe('Pruebas de Componente: Stock Actual y Mínimo', () => {
    it('ID 114: Stock Actual válido', () => {
      const m = new Medicamento(1, 'Paracetamol', 'Paracetamol trihidrato', 50, 10, FECHA_VALIDA);
      expect(m.stockActual).toBe(50);
    });

    it('ID 115: Rechazar Stock Actual negativo', () => {
      expect(() => new Medicamento(1, 'Paracetamol', 'Paracetamol trihidrato', -5, 10, FECHA_VALIDA))
        .toThrow('El stock no puede ser un número negativo');
    });

    it('ID 116: Stock Mínimo válido', () => {
      const m = new Medicamento(1, 'Paracetamol', 'Paracetamol trihidrato', 50, 10, FECHA_VALIDA);
      expect(m.stockMinimo).toBe(10);
    });

    it('ID 117: Rechazar Stock Mínimo < 1', () => {
      expect(() => new Medicamento(1, 'Paracetamol', 'Paracetamol trihidrato', 50, 0, FECHA_VALIDA))
        .toThrow('El stock mínimo debe ser mayor o igual a 1');
    });
  });

  describe('Pruebas de Componente: Fecha de Vencimiento', () => {
    it('ID 118: Fecha de vencimiento válida', () => {
      const m = new Medicamento(1, 'Paracetamol', 'Paracetamol trihidrato', 50, 10, FECHA_VALIDA);
      expect(m.fechaVencimiento).toBe(FECHA_VALIDA);
    });

    it('ID 119: Rechazar fecha menor a 2 meses en el futuro', () => {
      const proximoMes = new Date();
      proximoMes.setMonth(proximoMes.getMonth() + 1);
      const fechaCorta = proximoMes.toISOString().split('T')[0] as string; // Corrección aquí
      expect(() => new Medicamento(1, 'Paracetamol', 'Paracetamol trihidrato', 50, 10, fechaCorta))
        .toThrow('La fecha de vencimiento debe ser mayor a 2 meses');
    });

    it('ID 120: Rechazar fecha pasada', () => {
      const ayer = new Date();
      ayer.setDate(ayer.getDate() - 1);
      const fechaAyer = ayer.toISOString().split('T')[0] as string; // Corrección aquí
      expect(() => new Medicamento(1, 'Paracetamol', 'Paracetamol trihidrato', 50, 10, fechaAyer))
        .toThrow('La fecha de vencimiento debe ser mayor a 2 meses');
    });

    it('ID 121: Rechazar formato de fecha inválido', () => {
      expect(() => new Medicamento(1, 'Paracetamol', 'Paracetamol trihidrato', 50, 10, 'fecha-invalida'))
        .toThrow('Formato de fecha inválido');
    });
  });
});