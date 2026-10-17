import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UsuarioModel } from '../../login/infrastructure/UsuarioModel';

@Entity('especialidades')
export class EspecialidadInline {
  @PrimaryColumn({ name: 'id_especialidad' })
  id!: number;

  @Column({ name: 'nombre_especialidad' })
  nombre!: string;
}

@Entity('personal_salud')
export class PersonalModel {
  @PrimaryColumn({ type: 'varchar', length: 8 })
  dni!: string;

  @Column({ type: 'varchar', length: 50, name: 'nombre' })
  nombre!: string;

  @Column({ type: 'varchar', length: 50, name: 'apellidos' })
  apellidos!: string;

  @Column({ type: 'varchar', length: 20, name: 'colegiatura', nullable: true, unique: true })
  colegiatura!: string | null;

  @Column({ type: 'int', name: 'id_especialidad', nullable: true })
  idEspecialidad!: number | null;

  @ManyToOne(() => UsuarioModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'dni' })
  usuario!: UsuarioModel;

  @ManyToOne(() => EspecialidadInline, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_especialidad' })
  especialidad!: EspecialidadInline;
}