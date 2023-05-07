import { body } from 'express-validator';

export const emailSchema = body('email')
  .exists({ values: 'falsy' })
  .trim()
  .notEmpty()
  .withMessage('Field is required')
  .isString()
  .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
  .withMessage('Incorrect email');
