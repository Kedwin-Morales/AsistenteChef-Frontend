export interface UserDTO {
    id: string;
    documento: string;
    nombre: string;
    apellido: string;
    activo: boolean;
    role: { id: string; name: string } | null;
}

export interface CreateUserDTO {
    documento: string;
    nombre: string;
    apellido: string;
    password: string;
    rolId: string;
}

export interface UpdateUserDTO {
    documento: string;
    nombre: string;
    apellido: string;
    activo: boolean;
    rolId?: string;
}

export interface RolDTO {
    id: string;
    name: string;
}
