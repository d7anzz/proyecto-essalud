import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('medicamentos')
export class MedicamentoModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_medicamento' })
  idMedicamento!: number;

  @Column({ type: 'varchar', length: 100, name: 'nombre_medicamento' })
  nombreMedicamento!: string;

  @Column({ type: 'varchar', length: 150, name: 'composicion' })
  composicion!: string;

  @Column({ type: 'int', name: 'stock_actual' })
  stockActual!: number;

  @Column({ type: 'int', name: 'stock_minimo' })
  stockMinimo!: number;

  @Column({ type: 'date', name: 'fecha_vencimiento' })
  fechaVencimiento!: string;
}