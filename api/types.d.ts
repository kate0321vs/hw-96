export interface IUser {
    email: string;
    password: string;
    avatar: string;
    token: string;
    role: string;
    googleId?: string,
    displayName: string;
}