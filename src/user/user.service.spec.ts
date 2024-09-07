import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../database/prisma.service';

const user: User = {
  id: '1',
  email: 'test@test.com',
  password: 'password',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create User', () => {
    it('Should create a user', async () => {
      const dto: CreateUserDto = {
        email: user.email,
        password: user.password,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(user);

      const result = await service.create(dto);

      expect(result).toEqual(user);
    });

    it('Should throw an error if user already exists', async () => {
      const dto: CreateUserDto = {
        email: user.email,
        password: user.password,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      await expect(service.create(dto)).rejects.toThrow();
    });
  });

  describe('FindOneByEmail', () => {
    it('should find a user by email', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const result = await service.findOneByEmail(user.email);

      expect(result).toEqual(user);
    });

    it('should return null when not find user', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.findOneByEmail(user.email);

      expect(result).toEqual(null);
    });
  });
});
