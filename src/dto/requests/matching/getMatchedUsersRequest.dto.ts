import Joi from 'joi';

export interface IGetMatchedUsersRequestDto {
  size: number;
  page: number;
}

export const getMatchedUsersRequest = Joi.object({
  size: Joi.number().integer().min(1).required(),
  page: Joi.number().integer().min(1).required(),
});
