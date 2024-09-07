import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            signUp: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('Should be return the JWT token when sign in sucessfully', async () => {
    const token = 'JWT_TOKEN';
    const signInDto = { email: 'test@test.com', password: 'password' };

    jest
      .spyOn(authService, 'signIn')
      .mockResolvedValue({ access_token: token });

    expect(await controller.signIn(signInDto)).toStrictEqual({
      access_token: token,
    });
  });

  it('Should be return the user when sign up sucessfully', async () => {
    const signInDto = { email: 'test@test.com', password: 'password' };
    const user = {
      id: '1',
      email: signInDto.email,
      password: signInDto.password,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    jest.spyOn(authService, 'signUp').mockResolvedValue(user);

    expect(await controller.signUp(signInDto)).toBe(user);
  });
});
