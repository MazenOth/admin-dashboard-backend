export interface IGetUnmatchedClientsResponseDto {
  UserId: number;
  client_id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  city_name?: string;
  city_id?: number;
}
