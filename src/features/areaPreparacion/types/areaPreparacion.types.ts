export interface ModelDTO {
    areaPreparacionId: string;
    nombre?: string;
    descripcion?: string;
    activo?: boolean;
    detalle?: ModelDET[];
}

export interface ModelDET {
    AreaPreparacionDetId: string;
    areaPreparacionId?: string;
    //areaPreparacionNombre?: string;
    cantidad?: number;
    medida?: string;
    ingredienteId?: string;
    //ingredienteNombre?: string;
}

export interface CreateDTO {
    nombre?: string;
    descripcion?: string;
    detalle?: ModelDETCreate[];
}

export interface ModelDETCreate {
    ingredienteId?: string;
    cantidad?: number;
    medida?: string;
}

