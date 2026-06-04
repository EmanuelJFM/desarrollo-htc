import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: any) {
    const { username, password } = loginDto;
    
    // Credenciales semilla: admin / admin123
    if (username === 'admin' && password === 'admin123') {
      const payload = { username: username, sub: 1 };
      return {
        access_token: this.jwtService.sign(payload),
        expires_in: 1800, // 30 minutos en segundos
      };
    }
    
    throw new UnauthorizedException('Credenciales inválidas');
  }
}
