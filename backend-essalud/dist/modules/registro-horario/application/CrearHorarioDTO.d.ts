export interface CrearHorarioDTO {
    dni: string;
    fecha: string;
    horaInicio: string;
    turno: 'MAÑANA' | 'TARDE' | 'NOCHE';
    cantidadPacientes: number;
    estado?: 'DISPONIBLE' | 'OCUPADO';
}
//# sourceMappingURL=CrearHorarioDTO.d.ts.map