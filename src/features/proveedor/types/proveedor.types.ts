export interface ModelDTO {
  proveedorId: string;
  ruc: string;
  razonSocial: string;
  telefono: string;
  email: string;
  direccion: string;
  tipo: string;
  activo: boolean;
}

export interface CreateDTO {
  ruc: string;
  razonSocial: string;
  telefono: string;
  email: string;
  direccion: string;
  tipo: string;
}

export interface UpdateDTO {
  proveedorId: string;
  ruc: string;
  razonSocial: string;
  telefono: string;
  email: string;
  direccion: string;
  tipo: string;
  activo: boolean;
}
