export interface IPotentialHelperDto {
  id: number;
  user_id?: number;
  helper_id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
}

export interface IGetPotentialMatchesResponseDto {
  total: number;
  potentialHelpers: IPotentialHelperDto[];
}
