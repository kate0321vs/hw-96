export interface RegisterMutation {
    email: string;
    password: string;
    avatar: File | null;
    displayName: string;
}

export interface IUser {
    _id: string;
    email: string;
    password: string;
    avatar: string;
    token: string;
    role: string;
    googleId?: string,
    displayName: string;
}

export interface RegisterResponse {
    user: IUser;
    message: string;
}

export interface LoginMutation {
    email: string;
    password: string;
}

export interface ValidationError {
    errors: {
        [key: string]: {
            name: string;
            message: string;
        }
    };
    message: string;
    name: string;
    _message: string;
}

export interface GlobalError {
    error: string;
}