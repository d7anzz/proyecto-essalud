export interface RegistrarPersonalDTO {
  dni: string;            
  username: string;       
  nombre: string;        
  apellidos: string;      
  idRol: number;          
  colegiatura?: string;   
  idEspecialidad?: number; 
}