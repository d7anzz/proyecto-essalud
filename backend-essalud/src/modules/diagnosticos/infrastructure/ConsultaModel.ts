import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('consultas_medicas')
export class ConsultaModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_consulta' })
  idConsulta!: number;

  @Column({ type: 'int', name: 'id_cita' })
  idCita!: number;

  @Column({ type: 'varchar', length: 8, name: 'dni_paciente' })
  dniPaciente!: string;

  @Column({ type: 'varchar', length: 8, name: 'id_medico' })
  idMedico!: string;

  @Column({ type: 'text', name: 'diagnostico' })
  diagnostico!: string;

  @Column({ type: 'text', name: 'observaciones' })
  observaciones!: string;

  @Column({ type: 'timestamp', name: 'fecha_atencion', default: () => 'CURRENT_TIMESTAMP' })
  fechaAtencion!: Date;
}