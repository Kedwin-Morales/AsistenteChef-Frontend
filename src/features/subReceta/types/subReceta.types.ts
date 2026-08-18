export interface ModelSubDTO {
  subRecetaId: string;
  nombre: string;
  descripcion: string,
  porciones: string;
  rendimiento: string;
  activo: boolean;
  familiaMenuId: string;
  familiaMenu: {
    familiaMenuId: string;
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
  detalle?: ModelSubDET[];
  detPreparacion?: DetPreparacion[];
}

export interface ModelSubDET {
    subRecetaDetId: string;
    subRecetaId?: string;
    cantidad?: number;
    medida?: string;
    ingredienteId?: string;
    recetaId?: string;
}

export interface DetPreparacion {
    subPreparacionDetId: string;
    subRecetaId?: string;
    nroPaso?: number;
    descripcion?: string;
}

//Section 1
export interface CreateSubDTO {
  nombre?: string;
  descripcion?: string;
  porciones?: number;
  rendimiento?: string;
  familiaMenuId?: string;
  areaPreparacionId?: string;
  detalle?: ModelSubDETCreate[];
  detPreparacion?: AreaPreparacionDETCreate[];
}

//Section 2
export interface ModelSubDETCreate {
    ingredienteId?: string;
    recetaId?: string;
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