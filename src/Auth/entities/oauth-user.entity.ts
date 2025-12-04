import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Usuario } from '../../Usuarios/usuario.entity';

@Entity()
export class OAuthUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    provider: string;

    @Column()
    providerId: string;

    @Column()
    email: string;

    @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
    usuario: Usuario;

    @Column()
    usuarioId: number;

    @Column({ type: 'text', nullable: true })
    accessToken: string;

    @Column({ type: 'text', nullable: true })
    refreshToken: string;

    @CreateDateColumn()
    createdAt: Date;
}
