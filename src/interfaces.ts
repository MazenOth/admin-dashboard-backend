export interface IUser {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  RoleId?: number;
  CityId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRole {
  id?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHelper {
  id?: number;
  UserId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IClient {
  id?: number;
  UserId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICity {
  id?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMatching {
  id?: number;
  ClientId?: number;
  HelperId?: number;
  createdAt?: string;
  updatedAt?: string;
}
