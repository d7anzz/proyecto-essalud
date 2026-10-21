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

  @Column({ type: 'char', length: 1 })
  sexo!: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  telefono?: string;

  @Column({ name: 'tipo_seguro', type: 'varchar', length: 30, default: 'TITULAR' })
  tipoSeguro!: string;

  @Column({ name: 'grupo_sanguineo', type: 'varchar', length: 5, nullable: true })
  grupoSanguineo?: string;
}