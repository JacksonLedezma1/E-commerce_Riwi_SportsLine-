import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ){}

    createUser(dto: CreateUserDto){
        const user = this.userRepo.create(dto);
        return this.userRepo.save(user);
    }

    findAllUsers(){
        return this.userRepo.find();
    }

    findUserById(id: number) {
        return this.userRepo.findOneBy({ id });
    }

    async updateUser(id: number, dto: CreateUserDto) {
        await this.userRepo.update(id, dto);
        return this.findUserById( id );
    }

    deleteUser(id: number) {
        return this.userRepo.delete(id);
    }
}
