import api from "@/shared/services/api.instance";
import type {
  ModelDTO,
  CreateDTO,
  UpdateDTO,
} from "../types/tipoIngrediente.types";

export async function getAll(): Promise<ModelDTO[]> {
  const { data } = await api.get("/TipoIngrediente/lista");
  return data;
}

export async function crear(dto: CreateDTO): Promise<void> {
  await api.post("/TipoIngrediente/crear", {
    nombre: dto.nombre,
    descripcion: dto.descripcion,
  });
}

export async function editar(id: string, dto: UpdateDTO): Promise<void> {
  await api.put(`/TipoIngrediente/editar/${id}`, {
    tipoIngredienteId: id,
    nombre: dto.nombre,
    descripcion: dto.descripcion,
    activo: dto.activo,
  });
}

export async function anular(id: string, dto: UpdateDTO): Promise<void> {
  await api.put(`/TipoIngrediente/Anular/${id}`, {
    tipoIngredienteId: id,
    nombre: dto.nombre,
    descripcion: dto.descripcion,
    activo: dto.activo,
  });
}

export async function eliminar(id: string): Promise<void> {
  await api.put(`/TipoIngrediente/eliminar/${id}`);
}
