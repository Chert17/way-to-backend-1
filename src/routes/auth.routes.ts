import { Router } from 'express';

import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { authLoginRequestBodySchema } from '../validation/auth_login/auth.login.request.body.schema';

import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware';
import {
  emailResendingController,
  getMeController,
  loginController,
  registerationConfirmationController,
  registrationController,
} from '../controllers/auth.controller';
import { authRegisterRequestBodySchema } from '../validation/auth_login/auth.register.request.body.schema';
import { authRegisterConfirmRequestBodySchema } from '../validation/auth_login/auth.register.confirm.request.body.schema';
import { emailSchema } from '../validation/common/email.schema';

export const authgRouter = Router();

authgRouter.post(
  '/login',
  authLoginRequestBodySchema,
  validateRequestMiddleware,
  loginController
);

authgRouter.get('/me', jwtAuthMiddleware, getMeController);

authgRouter.post(
  '/registration',
  authRegisterRequestBodySchema,
  validateRequestMiddleware,
  registrationController
);

authgRouter.post(
  '/registration-confirmation',
  authRegisterConfirmRequestBodySchema,
  validateRequestMiddleware,
  registerationConfirmationController
);

authgRouter.post(
  '/registration-email-resending',
  emailSchema,
  validateRequestMiddleware,
  emailResendingController
);
