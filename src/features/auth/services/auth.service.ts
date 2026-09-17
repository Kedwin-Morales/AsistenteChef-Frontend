import api from "@/shared/services/api.instance";
import type { SolicitarCodigoDTO, VerificarCodigoDTO } from "../types/auth.types";

export const loginRequest = async (data: {
  documento: string;
  password: string;
}) => {
  const res = await api.post("auth/login", data);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("Auth/me");
  return res.data;
};

export async function solicitarCodigo(dto: SolicitarCodigoDTO): Promise<void> {
  await api.post("/auth/solicitarCodigo", {
    correo: dto.correo,
  });
}

export async function verificarCodigo(dto: VerificarCodigoDTO): Promise<void> {
  await api.post("/auth/VerificarCodigo", {
    correo: dto.correo,
    codigo: dto.codigo,
    nuevaPassword: dto.nuevaPassword
  });
}