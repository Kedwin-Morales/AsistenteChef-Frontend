export interface ModelDTO {
  montajeId: string;
  nombre: string;
  descripcion: string;
  porciones: string;
  costoUnidad: string;
  costoPorcion: string;
  precio: string;
  fecha: Date;
  urlImagen: string;
  activo: boolean;
  categoriaId: string;
  CategoriasPlato: {
    categoriaPlatoId: string;
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
  detalle?: ModelDET[];
  detPreparacion?: DetPreparacion[];
}

export interface ModelDET {
  montajeDetId: string;
  montajeId?: string;
  cantidad?: number;
  medida?: string;
  ingredienteId?: string;
  recetaId?: string;
  subRecetaId?: string;
}

export interface DetPreparacion {
  preparacionId: string;
  montajeId?: string;
  nroPaso?: number;
  descripcion?: string;
}

//Section 1
export interface CreateDTO {
  nombre?: string;
  descripcion?: string;
  porciones?: number;
  costoUnidad?: number;
  costoPorcion?: number;
  precio?: number;
  fecha?: Date;
  urlImagen?: string;
  file?: File;
  activo?: boolean;
  categoriaId?: string;
  areaPreparacionId?: string;
  detalle?: ModelDETCreate[];
  detPreparacion?: AreaPreparacionDETCreate[];
}

//Section 2
export interface ModelDETCreate {
  ingredienteId?: string;
  recetaId?: string;
  subRecetaId?: string;
  cantidad?: number;
  medida?: string;
}

//Section 3
export interface AreaPreparacionDETCreate {
  nroPaso?: number;
  Descripcion?: string;
}

export interface AreaPreparacionDET {
  AreaPreparacionDetId: string;
  areaPreparacionId?: string;
  cantidad?: number;
  medida?: string;
  ingredienteId?: string;
}
