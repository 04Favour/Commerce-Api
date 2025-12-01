/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3000),

  DATABASE_URL: Joi.string()
    .uri()
    .required()
    .messages({
      'any.required': 'DATABASE_URL is required!',
      'string.uri': 'DATABASE_URL must be a valid URI!',
    }),

  DATABASE_NAME: Joi.string().default('production-ready-db'),
});
