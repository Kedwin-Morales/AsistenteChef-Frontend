import api from "@/shared/services/api.instance";
import type { ModelDTO, CreateDTO, UpdateDTO, TipoIngredienteDTO, UnidadMedidaDTO } from "../types/ingrediente.types";

export async function getAll(): Promise<ModelDTO[]> {
    const { data } = await api.get("/Ingredientes/lista");
    return data;
}

export async function getTipo(): Promise<TipoIngredienteDTO[]> {
    const { data } = await api.get("/TipoIngrediente/lista");
    return data;
}

export async function getUnidad(): Promise<UnidadMedidaDTO[]> {
    const { data } = await api.get("/UnidadMedida/lista");
    return data;
}

export async function crear(dto: CreateDTO): Promise<void> {
    await api.post("/Ingredientes/crear", {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        costo: dto.costo,
        codigo: dto.codigo,
        tipoIngredienteId: dto.tipoIngredienteId,
        unidadMedidaId: dto.unidadMedidaId,
    });
}

export async function editar(id: string, dto: UpdateDTO): Promise<void> {
    await api.put(`/Ingredientes/editar/${id}`, {
        ingredienteId: id,
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        costo: dto.costo,
        codigo: dto.codigo,
        activo: dto.activo,
        tipoIngredienteId: dto.tipoIngredienteId,
        unidadMedidaId: dto.unidadMedidaId,
    });
}

export async function anular(id: string, dto: UpdateDTO): Promise<void> {
  await api.put(`/Ingredientes/anular/${id}`, {
        ingredienteId: id,
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        activo: dto.activo,
        tipoIngredienteId: dto.tipoIngredienteId,
        unidadMedidaId: dto.unidadMedidaId,
  });
}

export async function eliminar(id: string): Promise<void> {
    await api.put(`/Ingredientes/eliminar/${id}`);
}
