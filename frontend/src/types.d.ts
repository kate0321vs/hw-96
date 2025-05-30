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

export interface ICocktail {
    userId: string;
    _id: string;
    name: string;
    image: string;
    recipe: string;
    ingredients: { name: string; quantity: string};
    isPublished: boolean;
}

export interface ICocktailMutation {
    name: string;
    image: File | null;
    recipe: string;
    ingredients: { name: string; quantity: string};
}