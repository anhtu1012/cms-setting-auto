export declare class UserResponseDto {
    id: string;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    avatar?: string;
    points: number;
    walletBalance: number;
    lastLogin?: Date;
}
export declare class LoginResponseDto {
    accessToken: string;
    refreshToken: string;
    userProfile: UserResponseDto;
    expiresIn: number;
}
export declare class RegisterResponseDto {
    message: string;
    userProfile: UserResponseDto;
}
export declare class RefreshTokenResponseDto {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
