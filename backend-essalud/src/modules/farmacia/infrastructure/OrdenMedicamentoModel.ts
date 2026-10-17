import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ordenes_medicamentos')
export class OrdenMedicamentoModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_orden' })
  idOrden!: number;

  @Column({ type: 'int', name: 'id_consulta' })
  idConsulta!: number;

  @Column({ type: 'int', name: 'id_medicamento' })
  idMedicamento!: number;

  @Column({ type: 'int', name: 'cantidad_recetada' })
  cantidadRecetada!: number;

  @Column({ type: 'int', name: 'cantidad_entregada', default: 0 })
  cantidadEntregada!: number;

  @Column({ type: 'varchar', length: 15, name: 'estado_entrega', default: 'PENDIENTE' })
  estadoEntrega!: string;
}