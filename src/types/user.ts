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
    createdAt: string;
    updatedAt: string;
}