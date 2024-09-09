import Joi from 'joi';

export interface IDeleteUserRequestDto {
  id: number;
}

export const deleteUserRequestDto = Joi.object({
  id: Joi.number().integer().required().min(1),
});
