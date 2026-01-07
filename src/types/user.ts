export interface User {
    id: string;
    name: string;
    lastName: string;
    email: string;
    password?: string;
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    role: 'USER' | 'ADMIN';
    permissions: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type UserApiResponse = Omit<User, 'password'>;

export interface UserItem {
    id: string;
    date: string;
    name: string;
    role: string;
    address: string;
    permissions: string[];
    isActive: boolean;
}