export interface ModelDTO {
  consejoId: string;
  modulo: string;
  nombre: string;
  dificultad: string;
  descripcion: string;
  valor: string;
  fechaDesde: Date | null;
  fechaHasta: Date | null;
  activo: boolean;
}

export interface CreateDTO {
  modulo: string;
  nombre: string;
  dificultad: string;
  descripcion: string;
  valor: string;
  fechaDesde: Date | null;
  fechaHasta: Date | null;
}

export interface UpdateDTO {
  consejoId: string;
  modulo: string;
  nombre: string;
  dificultad: string;
  descripcion: string;
  valor: string;
  fechaDesde: Date | null;
  fechaHasta: Date | null;
  activo: boolean;
}
