import Joi from 'joi';

export interface IGetUnmatchedClientsRequestDto {
  size: number;
  page: number;
}

export const getUnmatchedClientsRequest = Joi.object({
  size: Joi.number().integer().min(1).required(),
  page: Joi.number().integer().min(1).required(),
});
