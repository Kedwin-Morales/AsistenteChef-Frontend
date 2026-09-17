export interface LoginRequest {
  documento: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface SolicitarCodigoDTO {
  correo: string;
}

export interface VerificarCodigoDTO {
  correo: string;
  codigo: string;
  nuevaPassword: string;
}