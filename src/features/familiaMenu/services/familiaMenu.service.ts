import api from "@/shared/services/api.instance";
import type {
  ModelDTO,
  CreateDTO,
  UpdateDTO,
} from "../types/familiaMenu.types";

export async function getAll(): Promise<ModelDTO[]> {
  const { data } = await api.get("/FamiliaMenu/lista");
  return data;
}

export async function crear(dto: CreateDTO): Promise<void> {
  await api.post("/FamiliaMenu/crear", {
    nombre: dto.nombre,
    descripcion: dto.descripcion,
  });
}

export async function editar(id: string, dto: UpdateDTO): Promise<void> {
  await api.put(`/FamiliaMenu/editar/${id}`, {
    familiaMenuId: id,
    nombre: dto.nombre,
    descripcion: dto.descripcion,
    activo: dto.activo,
  });
}

export async function anular(id: string, dto: UpdateDTO): Promise<void> {
  await api.put(`/FamiliaMenu/Anular/${id}`, {
    familiaMenuId: id,
    nombre: dto.nombre,
    descripcion: dto.descripcion,
    activo: dto.activo,
  });
}

export async function eliminar(id: string): Promise<void> {
  await api.put(`/FamiliaMenu/eliminar/${id}`);
}
