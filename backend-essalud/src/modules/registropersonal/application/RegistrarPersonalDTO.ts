export interface RegistrarPersonalDTO {
  dni: string;
  nombre: string;
  apellidos: string;
  username: string;
  idRol: number;
  colegiatura?: string | null;
  idEspecialidad?: number | null;
  telefono?: string | null;
  fecNac?: string | null;
}