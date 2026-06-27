import api from "@/shared/services/api.instance";
import type { ModelDTO, CreateDTO, UpdateDTO } from "../types/unidad.types";

export async function getAll(): Promise<ModelDTO[]> {
  const { data } = await api.get("/unidadMedida/lista");
  return data;
}

export async function crear(dto: CreateDTO): Promise<void> {
  await api.post("/unidadMedida/crear", {
    nombre: dto.nombre,
    simbolo: dto.simbolo,
  });
}

export async function editar(id: string, dto: UpdateDTO): Promise<void> {
  await api.put(`/unidadMedida/editar/${id}`, {
    unidadMedidaId: id,
    nombre: dto.nombre,
    simbolo: dto.simbolo,
    activo: dto.activo,
  });
}

export async function anular(id: string, dto: UpdateDTO): Promise<void> {
  await api.put(`/unidadMedida/Anular/${id}`, {
    unidadMedidaId: id,
    nombre: dto.nombre,
    simbolo: dto.simbolo,
    activo: dto.activo,
  });
}

export async function eliminar(id: string): Promise<void> {
  await api.put(`/unidadMedidad/eliminar/${id}`);
}
