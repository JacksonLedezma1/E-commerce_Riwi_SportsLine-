import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('client')
export class ClientController {
    constructor (private readonly clientService: ClientService){}

    @Roles('admin', 'seller')
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

    @Roles('admin', 'seller')
    @Put(':id')
    updateClient(@Param('id') id: number, @Body() dto: UpdateClientDto){
        return this.clientService.updateClient(id, dto);
    }

    @Roles('admin', 'seller')
    @Delete(':id')
    deleteClient(@Param('id') id: number){
        return this.clientService.deleteClient(id);
    }
}
