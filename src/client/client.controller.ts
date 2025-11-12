import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
export class ClientController {
    constructor (private readonly clientService: ClientService){}

    @Post()
    createClient(@Body() dto: CreateClientDto){
        return this.clientService.createClient(dto);
    }

    @Get()
    findAllClients(){
        return this.clientService.findAllClients();
    }

    @Get(':id')
    findClienById(@Param('id') id: number){
        return this.clientService.findClientById(id);
    }

    @Put(':id')
    updateClient(@Param('id') id: number, @Body() dto: UpdateClientDto){
        return this.clientService.updateClient(id, dto);
    }

    @Delete(':id')
    deleteClient(@Param('id') id: number){
        return this.clientService.deleteClient(id);
    }
}
