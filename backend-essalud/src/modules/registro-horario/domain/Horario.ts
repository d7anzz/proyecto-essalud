export class Horario {
  constructor(
    public readonly id: number,
    public readonly dni: string,                         
    public readonly fecha: string,                    
    public readonly horaInicio: string,                  
    public readonly horaFin: string,                      
    public readonly turno: 'MAÑANA' | 'TARDE' | 'NOCHE',   
    public readonly estado: 'DISPONIBLE' | 'OCUPADO' | boolean = 'DISPONIBLE'
  ) {}
}