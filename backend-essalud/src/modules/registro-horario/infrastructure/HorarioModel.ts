import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PersonalModel } from '../../registropersonal/infrastructure/PersonalModel';

@Entity('horarios_disponibles')
export class HorarioModel {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'varchar', length: 8 })
  dni!: string; 

  @ManyToOne(() => PersonalModel, { eager: true })
  @JoinColumn({ name: 'dni', referencedColumnName: 'dni' })
  personal!: PersonalModel;

  @Column({ type: 'date' })
  fecha!: string;

  @Column({ type: 'time' })
  horaInicio!: string; 

  @Column({ type: 'time' })
  horaFin!: string;

  @Column({ type: 'enum', enum: ['MAÑANA', 'TARDE', 'NOCHE'] })
  turno!: 'MAÑANA' | 'TARDE' | 'NOCHE';

  @Column({ type: 'tinyint' })
  estado!: boolean; 
}