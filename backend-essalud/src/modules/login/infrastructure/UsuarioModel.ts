import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'usuarios' }) 
export class UsuarioModel {
    @PrimaryColumn({ type: 'varchar', length: 8 })
    dni!: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    username!: string;

    @Column({ name: 'password_hash', type: 'varchar', length: 255 })
    passwordHash!: string;

    @Column({ name: 'id_rol', type: 'int' })
    idRol!: number;

    @Column({ type: 'tinyint', default: 1 })
    estado!: number;

    @Column({ name: 'intentos_fallidos', type: 'int', default: 0 })
    intentosFallidos!: number;

    @Column({ name: 'requiere_cambio_password', type: 'tinyint', default: 1 })
    requiereCambioPassword!: boolean;
}