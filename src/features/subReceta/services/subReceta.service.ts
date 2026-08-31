import api from "@/shared/services/api.instance";
import type { ModelSubDTO, CreateSubDTO } from "../types/subReceta.types";

export const getAll = async () => {
  const { data } = await api.get("/SubReceta/lista");
  return data;
};

export const getById = async (id: string) => {
  const { data } = await api.get(`/SubReceta/Buscar/${id}`);
  return data as ModelSubDTO;
};

export const crear = async (dto: CreateSubDTO) => {
  const res = await api.post("/SubReceta/crear", dto);
  return res.data;
};

export const editar = async (
  id: string,
  data: ModelSubDTO
) => {
  data.subRecetaId = id;
  const res = await api.put(`/SubReceta/Editar/${id}`, data);
  return res.data;
};

export const anular = async (
  id: string,
  data: ModelSubDTO
) => {
  data.subRecetaId = id;
  const res = await api.put(`/SubReceta/anular/${id}`, data);
  return res.data;
};

export const eliminar = async (id: string) => {
  const res = await api.delete(`/SubReceta/Eliminar/${id}`);
  return res.data;
};