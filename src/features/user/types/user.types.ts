export interface UserDTO {
    id: string;
    documento: string;
    nombre: string;
    apellido: string;
    correo?: string;
    activo: boolean;
    role: { id: string; name: string } | null;
}

export interface CreateUserDTO {
    documento: string;
    nombre: string;
    apellido: string;
    correo?: string;
    password: string;
    rolId: string;
}

export interface UpdateUserDTO {
    documento: string;
    nombre: string;
    apellido: string;
    correo?: string;
    activo: boolean;
    rolId?: string;
}

export interface RolDTO {
    id: string;
    name: string;
}
