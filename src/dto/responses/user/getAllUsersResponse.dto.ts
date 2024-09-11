export interface IUserDto {
  user_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  city_name?: string;
}

export interface IGetAllUsersResponseDto {
  total: number;
  users: IUserDto[];
}
