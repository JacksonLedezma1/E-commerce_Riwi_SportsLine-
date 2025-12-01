import { Body, Controller, Get, Post, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
    constructor (private readonly userService: UsersService){}

    @Roles('admin')
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

    @Get(':email')
    findByEmail(@Param('email') email: string){
        return this.userService.findByEmail(email);
    }

    @Roles('admin')
    @Put(':id')
    updateUser(@Param('id') id: number, @Body() dto: UpdateUserDto) {
        return this.userService.updateUser(id, dto);
    }

    @Roles('admin')
    @Delete(':id')
    deleteUser(@Param('id') id: number) {
        return this.userService.deleteUser(id);
    }
}
