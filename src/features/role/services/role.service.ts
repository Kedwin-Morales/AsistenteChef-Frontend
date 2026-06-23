import api from "@/shared/services/api.instance";
import type { RoleDTO } from "../types/role.types";

export async function getRoles(): Promise<RoleDTO[]> {
  const { data } = await api.get("/roles");
  return data;
}

export async function createRole(name: string): Promise<void> {
  await api.post("/roles", { name });
}

export async function updateRole(id: string, name: string): Promise<void> {
  await api.put(`/roles/${id}`, { name });
}

export async function deleteRole(id: string): Promise<void> {
  await api.delete(`/roles/${id}`);
}
