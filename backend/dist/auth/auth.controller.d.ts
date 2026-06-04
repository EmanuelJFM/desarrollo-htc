import { AuthService } from './auth.service';
declare class LoginDto {
    username: string;
    password: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        expires_in: number;
    }>;
}
export {};
