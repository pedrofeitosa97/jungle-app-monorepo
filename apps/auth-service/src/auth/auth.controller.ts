import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const existingUser = await this.authService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new HttpException('Email já está em uso', HttpStatus.BAD_REQUEST);
    }

    const existingUsername = await this.authService.findByUsername(
      registerDto.username,
    );
    if (existingUsername) {
      throw new HttpException(
        'Nome de usuário já está em uso',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const user = await this.authService.register(registerDto);
      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao registrar usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    if (!result) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }
    return result;
  }
}
