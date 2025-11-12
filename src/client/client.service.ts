import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepo: Repository<Client>
    ){}

    createClient (dto: CreateClientDto){
        const client = this.clientRepo.create(dto);
        return this.clientRepo.save(client);
    }

    findAllClients(){
        return this.clientRepo.find();
    }

    findClientById(id: number){
        return this.clientRepo.findOneBy({ id });
    }

    async updateClient(id: number, dto: UpdateClientDto){
        await this.clientRepo.update(id, dto);
        return this.findClientById( id );
    }

    deleteClient(id: number) {
        return this.clientRepo.delete(id);
    }
}
