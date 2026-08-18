import api from "@/shared/services/api.instance";
import type { ModelDTO, CreateDTO } from "../types/receta.types";

export const getAll = async () => {
  const { data } = await api.get("/Receta/lista");
  return data;
};

export const getById = async (id: string) => {
  const { data } = await api.get(`/Receta/Buscar/${id}`);
  return data as ModelDTO;
};

export const crear = async (dto: CreateDTO) => {
  const res = await api.post("/Receta/crear", dto);
  return res.data;
};

export const editar = async (
  id: string,
  data: ModelDTO
) => {
  data.recetaId = id;
  const res = await api.put(`/Receta/Editar/${id}`, data);
  return res.data;
};

export const anular = async (
  id: string,
  data: ModelDTO
) => {
  data.recetaId = id;
  const res = await api.put(`/Receta/anular/${id}`, data);
  return res.data;
};

export const eliminar = async (id: string) => {
  const res = await api.delete(`/Receta/Eliminar/${id}`);
  return res.data;
};