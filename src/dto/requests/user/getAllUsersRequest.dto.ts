import Joi from 'joi';

export interface IGetAllUsersRequestDto {
  paginationOptions: { size: number; page: number };
  role_name: string;
}

export const getAllUsersRequestDto = Joi.object({
  paginationOptions: Joi.object({
    size: Joi.number().integer().min(1).required(),
    page: Joi.number().integer().min(1).required(),
  }).required(),

  role_name: Joi.string().required().valid('client', 'helper'),
});
