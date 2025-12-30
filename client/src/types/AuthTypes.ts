import type { AuthUserDTO } from "./UserDTO";

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: AuthUserDTO;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: AuthUserDTO | null;
    token: string | null;
    refreshToken: string | null;
}