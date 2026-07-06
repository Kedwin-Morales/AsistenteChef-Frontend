import api from "@/shared/services/api.instance";
import type { ModelDTO, CreateDTO } from "../types/areaPreparacion.types";

export const getAll = async() => {
    const { data } = await api.get("/AreaPreparacion/lista");
    return data;
}

export const crear = async(dto: CreateDTO) => {
    const res = await api.post("/AreaPreparacion/crear", dto);
    return res.data;
}

export const editar = async (
  id: string,
  data: ModelDTO
) => {
  //console.log(data)
  data.areaPreparacionId = id;
  const res = await api.put(`/AreaPreparacion/Editar/${id}`, data);
  return res.data;
};

export const anular = async (
  id: string,
  data: ModelDTO
) => {
  //console.log(data)
  data.areaPreparacionId = id;
  const res = await api.put(`/AreaPreparacion/anular/${id}`, data);
  return res.data;
};

export const eliminar = async (id: string) => {
  const res = await api.delete(`/AreaPreparacion/Eliminar/${id}`);
  return res.data;
};