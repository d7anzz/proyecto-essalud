export class Medicamento {
  constructor(
    public readonly idMedicamento: number,
    public readonly nombreMedicamento: string,
    public readonly composicion: string,
    public readonly stockActual: number,
    public readonly stockMinimo: number,
    public readonly fechaVencimiento: string
  ) {
    // 1. Validaciones de Nombre
    if (nombreMedicamento === undefined || nombreMedicamento === null || nombreMedicamento.trim() === '') {
      throw new Error('El campo es obligatorio');
    }

    const nombreLimpio = nombreMedicamento.trim();
    if (nombreLimpio.length < 3 || nombreLimpio.length > 100) {
      throw new Error('El nombre debe tener entre 3 y 100 caracteres');
    }

    // 2. Validaciones de Composición
    if (composicion === undefined || composicion === null || composicion.trim() === '') {
      throw new Error('El campo es obligatorio');
    }

    const composicionLimpia = composicion.trim();
    if (composicionLimpia.length < 3 || composicionLimpia.length > 150) {
      throw new Error('La composición debe tener entre 3 y 150 caracteres');
    }

    // 3. Validaciones de Stocks
    if (stockActual < 0) {
      throw new Error('El stock no puede ser un número negativo');
    }

    if (stockMinimo < 1) {
      throw new Error('El stock mínimo debe ser mayor o igual a 1');
    }

    // 4. Validaciones de Fecha de Vencimiento
    if (!fechaVencimiento || isNaN(Date.parse(fechaVencimiento))) {
      throw new Error('Formato de fecha inválido');
    }

    const fechaIngresada = new Date(fechaVencimiento);
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() + 2);

    if (fechaIngresada < fechaLimite) {
      throw new Error('La fecha de vencimiento debe ser mayor a 2 meses');
    }
  }
}