import Joi from 'joi';

export interface IGetAllUsersRequestDto {
  size: number;
  page: number;
  role_name: string;
}

export const getAllUsersRequestDto = Joi.object({
  size: Joi.number().integer().min(1).required(),
  page: Joi.number().integer().min(1).required(),
  role_name: Joi.string().required().valid('client', 'helper'),
});
