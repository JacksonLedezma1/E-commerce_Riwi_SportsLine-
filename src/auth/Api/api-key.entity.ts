import { baseEntity } from "src/shared/base.entity";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('api_keys')
export class ApiKey extends baseEntity {
    @Column({ unique: true })
    key: string;

    @Column('simple-array', { default: '' } )
    scopes: string[];

    @Column({ default: true })
    isActive: boolean;

    @Column()
    owner: string;  ///Identificacion del sistema externo
}