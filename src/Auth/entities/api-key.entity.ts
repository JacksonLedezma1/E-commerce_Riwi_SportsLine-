import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Usuario } from '../../Usuarios/usuario.entity';

@Entity()
export class ApiKey {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 64 })
    key: string;

    @Column()
    name: string;

    @Column('simple-array')
    scopes: string[];

    @ManyToOne(() => Usuario, { nullable: true, onDelete: 'CASCADE' })
    usuario: Usuario;

    @Column({ nullable: true })
    usuarioId: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastUsedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
