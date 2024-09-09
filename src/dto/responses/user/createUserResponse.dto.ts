export interface ICreateUserResponseDto {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    RoleId: number;
    CityId: number;
  };
  role: {
    id: number;
    UserId: number;
  };
}
