import Joi from 'joi';

export interface IUpdateUserRequestDto {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  city_name: string;
}

export const updateUserRequestDto = Joi.object({
  id: Joi.number().integer().required().min(1),
  first_name: Joi.string().required().min(2).max(225),
  last_name: Joi.string().required().min(2).max(225),
  email: Joi.string().required().min(3).max(225).email(),
  phone_number: Joi.string().required().min(11).max(225),
  city_name: Joi.string().required().min(3).max(225),
});
