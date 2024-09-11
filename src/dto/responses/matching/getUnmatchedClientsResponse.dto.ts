export interface IClientDto {
  id: number;
  user_id?: number;
  client_id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  city_name?: string;
  city_id?: number;
}

export interface IGetUnmatchedClientsResponseDto {
  total: number;
  clients: IClientDto[];
}
