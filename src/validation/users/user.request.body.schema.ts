import { body } from 'express-validator';

export const userRequestBodySchema = [
  body('email')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .withMessage('Field is required')
    .isString()
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .withMessage('Incorrect email')
    .isLength({ max: 20, min: 6 })
    .withMessage('Field must be min 6 and no more 20 characters'),

  body('login')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .withMessage('Field is required')
    .isString()
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Incorrect login')
    .isLength({ max: 10, min: 3 })
    .withMessage('Fueld must be min 3 and no more 10 characters'),

  body('password')
    .exists({ values: 'falsy' })
    .trim()
    .notEmpty()
    .withMessage('Field is required')
    .isString()
    .withMessage('Field must be a string')
    .isLength({ max: 20, min: 6 })
    .withMessage('Field must be min 6 and no more 20 characters'),
];
