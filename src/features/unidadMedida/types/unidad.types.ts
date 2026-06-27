export interface ModelDTO {
  unidadMedidaId: string;
  nombre: string;
  simbolo: string;
  activo: boolean;
}

export interface CreateDTO {
  nombre: string;
  simbolo: string;
}

export interface UpdateDTO {
  unidadMedidaId: string;
  nombre: string;
  simbolo: string;
  activo: boolean;
}
