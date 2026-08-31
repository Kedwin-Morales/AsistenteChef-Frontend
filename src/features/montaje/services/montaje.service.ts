import api from "@/shared/services/api.instance";
import type { ModelDTO, CreateDTO } from "../types/montaje.types";

export const getAll = async () => {
  const { data } = await api.get("/Montaje/lista");
  return data;
};

export const getById = async (id: string) => {
  const { data } = await api.get(`/Montaje/Buscar/${id}`);
  return data as ModelDTO;
};

export const crear = async (dto: CreateDTO) => {
  const res = await api.post("/Montaje/crear", dto);
  return res.data;
};

export const editar = async (
  id: string,
  data: ModelDTO
) => {
  data.montajeId = id;
  const res = await api.put(`/Montaje/Editar/${id}`, data);
  return res.data;
};

export const anular = async (
  id: string,
  data: ModelDTO
) => {
  data.montajeId = id;
  const res = await api.put(`/Montaje/anular/${id}`, data);
  return res.data;
};

export const eliminar = async (id: string) => {
  const res = await api.delete(`/Montaje/Eliminar/${id}`);
  return res.data;
};