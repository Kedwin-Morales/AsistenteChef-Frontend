export interface ModelDTO {
  tipoIngredienteId: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface CreateDTO {
  nombre: string;
  descripcion: string;
}

export interface UpdateDTO {
  tipoIngredienteId: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}
