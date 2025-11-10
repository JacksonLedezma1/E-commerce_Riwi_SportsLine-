import { Body, Controller, Get, Post, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor (private readonly userService: UsersService){}

    @Post()
    create(@Body() dto: CreateUserDto){
        return this.userService.createUser(dto);
    }

    @Get()
    findAllUsers(){
        return this.userService.findAllUsers();
    }

    @Get(':id')
    findUserById(@Param('id') id: number) {
    return this.userService.findUserById(id);
    }

    @Put(':id')
    updateUser(@Param('id') id: number, @Body() dto: CreateUserDto) {
        return this.userService.updateUser(id, dto);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: number) {
        return this.userService.deleteUser(id);
    }
}
