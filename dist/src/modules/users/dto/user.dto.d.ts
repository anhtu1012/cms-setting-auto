export declare class CreateUserDto {
    email: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
    avatar?: string;
}
export declare class UpdateUserDto {
    userName?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    avatar?: string;
    isActive?: boolean;
    points?: number;
    walletBalance?: number;
}
