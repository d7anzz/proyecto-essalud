export class Medicamento {
  constructor(
    public readonly idMedicamento: number,
    public readonly nombreMedicamento: string,
    public readonly composicion: string,
    public readonly stockActual: number,
    public readonly stockMinimo: number,
    public readonly fechaVencimiento: string
  ) {}
}