import api from "@/shared/services/api.instance";
import type { ModelDTO, CreateDTO, UpdateDTO } from "../types/consejo.types";

export async function getAll(): Promise<ModelDTO[]> {
  const { data } = await api.get("/ConsejoParameter/lista");
  return data;
}

export async function crear(dto: CreateDTO): Promise<void> {
  await api.post("/ConsejoParameter/crear", {
    modulo: dto.modulo,
    nombre: dto.nombre,
    dificultad: dto.dificultad,
    descripcion: dto.descripcion,
    valor: dto.valor,
    fechaDesde: dto.fechaDesde,
    fechaHasta: dto.fechaHasta,
  });
}

export async function editar(id: string, dto: UpdateDTO): Promise<void> {
  await api.put(`/ConsejoParameter/editar/${id}`, {
    consejoId: id,
    modulo: dto.modulo,
    nombre: dto.nombre,
    dificultad: dto.dificultad,
    descripcion: dto.descripcion,
    valor: dto.valor,
    fechaDesde: dto.fechaDesde,
    fechaHasta: dto.fechaHasta,
    activo: dto.activo,
  });
}

export async function anular(id: string, dto: UpdateDTO): Promise<void> {
  await api.put(`/ConsejoParameter/Anular/${id}`, {
    consejoId: id,
    modulo: dto.modulo,
    nombre: dto.nombre,
    dificultad: dto.dificultad,
    descripcion: dto.descripcion,
    valor: dto.valor,
    fechaDesde: dto.fechaDesde,
    fechaHasta: dto.fechaHasta,
    activo: dto.activo,
  });
}

export async function eliminar(id: string): Promise<void> {
  await api.put(`/ConsejoParameter/eliminar/${id}`);
}
