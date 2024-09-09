import Joi from 'joi';

export interface ICreateUserRequestDto {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role_name: string;
  city_name: string;
}

export const createUserRequestDto = Joi.object({
  first_name: Joi.string().required().min(2).max(225),
  last_name: Joi.string().required().min(2).max(225),
  email: Joi.string().required().min(3).max(225).email(),
  phone_number: Joi.string().required().min(11).max(225),
  role_name: Joi.string().required().valid('client', 'helper'),
  city_name: Joi.string().required().min(3).max(225),
});