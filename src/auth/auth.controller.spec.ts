import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { apiResponse } from '../utils/response.utils';

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('Should be return the JWT token when sign in sucessfully', async () => {
    const token = 'JWT_TOKEN';
    const signInDto = { email: 'test@test.com', password: 'password' };

    jest
      .spyOn(authService, 'signIn')
      .mockResolvedValue({ access_token: token });

    expect(await controller.signIn(signInDto)).toStrictEqual(
      apiResponse(200, { access_token: token }, [
        { message: 'User logged successfully', property: 'User' },
      ]),
    );
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

    expect(await controller.signUp(signInDto)).toStrictEqual(
      apiResponse(201, user, [
        {
          message: 'User created successfully',
          property: 'user',
        },
      ]),
    );
  });
});
