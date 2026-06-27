import api from "@/shared/services/api.instance";
import type { UserDTO, CreateUserDTO, UpdateUserDTO, RolDTO } from "../types/user.types";

export async function getUsers(): Promise<UserDTO[]> {
    const { data } = await api.get("/auth/all");
    return data;
}

export async function getRoles(): Promise<RolDTO[]> {
    const { data } = await api.get("/auth/roles");
    return data;
}

export async function createUser(dto: CreateUserDTO): Promise<void> {
    await api.post("/auth/register", {
        tipoDocumentoID: "00000000-0000-0000-0000-000000000000",
        documento: dto.documento,
        nombre: dto.nombre,
        apellido: dto.apellido,
        password: dto.password,
        rolId: dto.rolId,
    });
}

export async function updateUser(id: string, dto: UpdateUserDTO): Promise<void> {
    await api.put(`/auth/Actualizar/${id}`, {
        tipoDocumentoID: "00000000-0000-0000-0000-000000000000",
        documento: dto.documento,
        nombre: dto.nombre,
        apellido: dto.apellido,
        activo: dto.activo,
        rolId: dto.rolId,
    });
}

export async function deleteUser(id: string): Promise<void> {
    await api.put(`/auth/Anular/${id}`);
}
