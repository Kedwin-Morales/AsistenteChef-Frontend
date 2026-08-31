import api from "@/shared/services/api.instance";
import type { ModelDTO, CreateDTO } from "../types/montaje.types";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Formato de imagen no permitido. Use JPG, PNG o WebP.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "La imagen excede el tamaño máximo de 5 MB.";
  }
  return null;
}

function toFormData(dto: CreateDTO): FormData {
  const { file, ...model } = dto;

  const formData = new FormData();
  formData.append("model", JSON.stringify(model));

  if (file) {
    const error = validateImageFile(file);
    if (error) {
      throw new Error(error);
    }
    formData.append("file", file);
  }

  return formData;
}

export const getAll = async () => {
  const { data } = await api.get("/Montaje/lista");
  return data;
};

export const getById = async (id: string) => {
  const { data } = await api.get(`/Montaje/Buscar/${id}`);
  return data as ModelDTO;
};

export const crear = async (dto: CreateDTO) => {
  const formData = toFormData(dto);
  console.log(formData);
  const res = await api.post("/Montaje/Crear", formData);
  return res.data;
};

export const editar = async (id: string, dto: CreateDTO) => {
  const formData = toFormData(dto);
  const res = await api.put(`/Montaje/Editar/${id}`, formData);
  return res.data;
};

export const anular = async (id: string, data: ModelDTO) => {
  data.montajeId = id;
  const res = await api.put(`/Montaje/anular/${id}`, data);
  return res.data;
};

export const eliminar = async (id: string) => {
  const res = await api.delete(`/Montaje/Eliminar/${id}`);
  return res.data;
};