export interface LoginRequest {
  documento: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}
