import Joi from 'joi';

export interface IAssignHelperRequestDto {
  client_id: number;
  helper_id: number;
}

export const assignHelperRequestDto = Joi.object({
  client_id: Joi.number().integer().required().min(1),
  helper_id: Joi.number().integer().required().min(1),
});
