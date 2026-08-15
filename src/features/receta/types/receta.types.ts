export interface ModelDTO {
  recetaId: string;
  nombre: string;
  descripcion: string,
  porciones: string;
  rendimiento: string;
  activo: boolean;
  familiaMenu: {
    familiaMenuId: string;
    nombre: string;
    descripcion: string;
    activo: boolean;
  } | null;
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
    recetaDetId: string;
    recetaId?: string;
    cantidad?: number;
    medida?: string;
    ingredienteId?: string;
}

export interface DetPreparacion {
    preparacionDetId: string;
    recetaId?: string;
    nroPaso?: number;
    descripcion?: string;
}

//Section 1
export interface CreateDTO {
  nombre?: string;
  descripcion?: string;
  porciones?: number;
  rendimiento?: string;
  familiaMenuId?: string;
  areaPreparacionId?: string;
  detalle?: ModelDETCreate[];
  detPreparacion?: AreaPreparacionDETCreate[];
}

//Section 2
export interface ModelDETCreate {
    ingredienteId?: string;
    cantidad?: number;
    medida?: string;
}

//Section 3
export interface AreaPreparacionDETCreate {
    nroPaso?: number;
    Descripcion?: string;
}

export interface AreaPreparacionDET{
    AreaPreparacionDetId: string;
    areaPreparacionId?: string;
    cantidad?: number;
    medida?: string;
    ingredienteId?: string;
}