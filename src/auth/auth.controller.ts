import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { apiResponse } from '../utils/response.utils';

@ApiTags('Auth routes')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up', description: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'Return the user when sign up successfully',
  })
  @ApiBadRequestResponse({ description: 'User already exists' })
  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    const userLogged = await this.authService.signUp(
      signUpDto.email,
      signUpDto.password,
    );

    return apiResponse(HttpStatus.CREATED, userLogged, [
      {
        message: 'User created successfully',
        property: 'user',
      },
    ]);
  }

  @ApiOperation({ summary: 'Sign in', description: 'Use can sign in on API' })
  @ApiOkResponse({
    description: 'Return the JWT token when sign in successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto) {
    const token = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    return apiResponse(HttpStatus.OK, token, [
      {
        message: 'User logged successfully',
        property: 'User',
      },
    ]);
  }
}
