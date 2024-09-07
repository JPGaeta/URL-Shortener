import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const user = {
  id: '1',
  email: 'test@test.com',
  password: 'hashedpassword',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('SignIn', () => {
    it('Should return a JWT when credentials are valid', async () => {
      const token = 'token';

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      expect(await service.signIn(user.email, 'password')).toEqual({
        access_token: token,
      });
    });

    it("Should throw an error if user doesn't exist", async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);

      try {
        await service.signIn(user.email, user.password);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(404);
        expect(error.message).toBe('User not found');
      }
    });

    it('Should throw an error if password is incorrect', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      try {
        await service.signIn(user.email, 'wrongpassword');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(400);
        expect(error.message).toBe('Invalid email or password');
      }
    });
  });

  describe('signUp', () => {
    it('should return a user when registration is successful', async () => {
      jest.spyOn(userService, 'create').mockResolvedValue(user);

      expect(await service.signUp(user.email, 'password')).toEqual({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: null,
      });
    });
  });
});
