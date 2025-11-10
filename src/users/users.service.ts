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

    findUserById(id) {
    return this.userRepo.findOneBy({ id });
  }
}
