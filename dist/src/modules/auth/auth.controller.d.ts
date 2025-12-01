import { AuthService } from './auth.service';
import { LoginRequestDto, RegisterRequestDto, RefreshTokenRequestDto } from './dto/auth-request.dto';
import { LoginResponseDto, RegisterResponseDto, RefreshTokenResponseDto } from './dto/auth-response.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginRequestDto): Promise<LoginResponseDto>;
    register(registerDto: RegisterRequestDto): Promise<RegisterResponseDto>;
    refreshToken(refreshTokenDto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto>;
    logout(refreshTokenDto: RefreshTokenRequestDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
