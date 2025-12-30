export type Role = "ADMIN" | "CUSTOMER" | "STAFF";

export type AuthUserDTO = {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  pictureUrl: string;
};

export type AddressResponseDTO = {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type UserResponseDTO = {
  id: string;
  email: string;
  role: Role;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
  addressResponseDto: AddressResponseDTO;
  phone: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
};

export type AddressRequestDTO = {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

export type UserRequestDTO = {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
};
