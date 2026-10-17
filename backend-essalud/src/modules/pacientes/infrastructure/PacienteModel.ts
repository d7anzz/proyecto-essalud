import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('pacientes')
export class PacienteModel {
  @PrimaryColumn({ type: 'varchar', length: 8 })
  dni!: string;

  @Column({ type: 'varchar', length: 50 })
  nombre!: string;

  @Column({ type: 'varchar', length: 50 })
  apellidos!: string;

  @Column({ name: 'fec_nac', type: 'date' })
  fechaNacimiento!: Date;
}