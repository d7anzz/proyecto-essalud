import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PacienteModel } from '../../pacientes/infrastructure/PacienteModel';
import { HorarioModel } from '../../registro-horario/infrastructure/HorarioModel';

@Entity('citas_medicas')
export class CitaModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_cita' })
  idCita!: number;

  @Column({ type: 'varchar', length: 8, name: 'dni_paciente' })
  dniPaciente!: string;

  @Column({ type: 'varchar', length: 8, name: 'id_medico' })
  idMedico!: string;

  @Column({ type: 'int', name: 'id_horario' })
  idHorario!: number;

  @Column({ type: 'varchar', length: 20, name: 'estado' })
  estado!: 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA';

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @ManyToOne(() => PacienteModel, { eager: true })
  @JoinColumn({ name: 'dni_paciente' })
  paciente!: PacienteModel;

  @ManyToOne(() => HorarioModel, { eager: true })
  @JoinColumn({ name: 'id_horario' })
  horario!: HorarioModel;
}