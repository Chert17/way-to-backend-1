import { body } from 'express-validator';

export const authLoginRequestBodySchema = [
  body('loginOrEmail')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Field is required'),

  body('password')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Field is required'),
];
