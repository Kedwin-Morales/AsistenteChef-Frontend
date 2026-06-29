export interface ModelDTO {
  familiaMenuId: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface CreateDTO {
  nombre: string;
  descripcion: string;
}

export interface UpdateDTO {
  familiaMenuId: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}
