export interface ModelDTO {
  mermaId: string;
  cantidad: string;
  motivo: string;
  fecha: Date;
  urlImagen: string;
  activo: boolean;
  recetaId: string;
  receta: {
    recetaId: string;
    nombre: string;
    descripcion: string;
    activo: boolean;
  } | null;
  subRecetaId: string;
  subReceta: {
    subRecetaId: string;
    nombre: string;
    descripcion: string;
    activo: boolean;
  } | null;
  areaPreparacionId: string;
  areaPreparacion: {
    areaPreparacionId: string;
    nombre: string;
    descripcion: string;
    detalle: AreaPreparacionDET[];
    activo: boolean;
  } | null;
  unidadMedidaId: string;
  unidadMedida: {
    unidadMedidaId: string;
    nombre: string;
    descripcion: string;
    activo: boolean;
  } | null;
}

export interface CreateDTO {
  motivo?: string;
  cantidad?: number;
  fecha?: Date;
  urlImagen?: string;
  file?: File;
  activo?: boolean;
  recetaId?: string;
  subRecetaId?: string;
  areaPreparacionId?: string;
  unidadMedidaId?: string;
}

export interface AreaPreparacionDET {
  AreaPreparacionDetId: string;
  areaPreparacionId?: string;
  cantidad?: number;
  medida?: string;
  ingredienteId?: string;
}
