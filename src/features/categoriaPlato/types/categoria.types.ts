export interface ModelDTO {
  categoriaPlatoId: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface CreateDTO {
  nombre: string;
  descripcion: string;
}

export interface UpdateDTO {
  categoriaPlatoId: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}
