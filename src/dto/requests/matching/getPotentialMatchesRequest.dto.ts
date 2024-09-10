import Joi from 'joi';

export interface IGetPotentialMatchesRequestDto {
  size: number;
  page: number;
  client_id: number;
}

export const getPotentialMatchesRequestDto = Joi.object({
  size: Joi.number().integer().min(1).required(),
  page: Joi.number().integer().min(1).required(),
  client_id: Joi.number().integer().required().min(1),
});
