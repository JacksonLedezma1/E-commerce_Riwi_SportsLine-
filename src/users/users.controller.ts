import { Body, Controller, Get, Post, Param } from '@nestjs/common';
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
    findUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }
}
