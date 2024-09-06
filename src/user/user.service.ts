import { Injectable, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../database/prisma.service';
import { User } from '@prisma/client';
import { v7 as uuidv7 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const userExists = await this.findOneByEmail(data.email);
    if (userExists) {
      throw new HttpException('User already exists', 400);
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(data.password, saltOrRounds);
    delete data.password;

    const id: string = uuidv7();

    const user = await this.prismaService.user.create({
      data: { ...data, id, password: hash },
    });

    return user;
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }
}
