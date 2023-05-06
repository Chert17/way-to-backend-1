import { body } from 'express-validator';

export const authRegisterConfirmRequestBodySchema = [
  body('code')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Field is required'),
];
