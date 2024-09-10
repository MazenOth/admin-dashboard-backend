import Joi from 'joi';

export interface IUnassignHelperRequestDto {
  client_id: number;
  helper_id: number;
}

export const unassignHelperRequestDto = Joi.object({
  client_id: Joi.number().integer().required().min(1),
  helper_id: Joi.number().integer().required().min(1),
});
