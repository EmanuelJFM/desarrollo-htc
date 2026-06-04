import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Nombre de usuario' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: 'admin123', description: 'Contraseña de acceso' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión y obtener token JWT' })
  @ApiResponse({ status: 200, description: 'Sesión exitosa, retorna token JWT con validez de 30 minutos.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
