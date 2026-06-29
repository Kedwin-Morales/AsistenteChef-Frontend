export interface ModelDTO {
  ingredienteId: string;
  nombre: string;
  descripcion: string;
  costo: number;
  codigo: string;
  activo: boolean;
  tipoIngrediente: {
    tipoIngredienteId: string;
    nombre: string;
    descripcion: string;
    activo: boolean;
  } | null;
  unidadMedida: {
    unidadMedidaId: string;
    nombre: string;
    simbolo: string;
    activo: boolean;
  } | null;
}

export interface CreateDTO {
  nombre: string;
  descripcion: string;
  costo: number;
  codigo: string;
  tipoIngredienteId: string;
  unidadMedidaId: string;
}

export interface UpdateDTO {
  ingredienteId: string;
  nombre: string;
  descripcion: string;
  costo: number;
  codigo: string;
  activo: boolean;
  tipoIngredienteId?: string;
  unidadMedidaId?: string;
}

export interface TipoIngredienteDTO {
  tipoIngredienteId: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface UnidadMedidaDTO {
  unidadMedidaId: string;
  nombre: string;
  simbolo: string;
  activo: boolean;
}
