export interface CrearHorarioDTO {
  dni: string;
  fecha: string;
  horaInicio: string;                  // El inicio del turno (ej: "08:00")
  turno: 'MAÑANA' | 'TARDE' | 'NOCHE';
  cantidadPacientes: number;           // 🎯 NUEVO: Cuántas citas abrirá el médico
  estado?: 'DISPONIBLE' | 'OCUPADO';
}