import api from "@/shared/services/api.instance";
import type {
  ModelDTO,
  CreateDTO,
  UpdateDTO,
} from "../types/proveedor.types";

export async function getAll(): Promise<ModelDTO[]> {
  const { data } = await api.get("/Proveedor/lista");
  return data;
}

export async function crear(dto: CreateDTO): Promise<void> {
  await api.post("/Proveedor/crear", {
    ruc: dto.ruc,
    razonSocial: dto.razonSocial,
    telefono: dto.telefono,
    email: dto.email,
    direccion: dto.direccion,
    tipo: dto.tipo,
  });
}

export async function editar(id: string, dto: UpdateDTO): Promise<void> {
  await api.put(`/Proveedor/editar/${id}`, {
    proveedorId: id,
    ruc: dto.ruc,
    razonSocial: dto.razonSocial,
    telefono: dto.telefono,
    email: dto.email,
    direccion: dto.direccion,
    tipo: dto.tipo,
    activo: dto.activo,
  });
}

export async function anular(id: string, dto: UpdateDTO): Promise<void> {
  await api.put(`/Proveedor/Anular/${id}`, {
    proveedorId: id,
    ruc: dto.ruc,
    razonSocial: dto.razonSocial,
    telefono: dto.telefono,
    email: dto.email,
    direccion: dto.direccion,
    tipo: dto.tipo,
    activo: dto.activo,
  });
}

export async function eliminar(id: string): Promise<void> {
  await api.put(`/Proveedor/eliminar/${id}`);
}
