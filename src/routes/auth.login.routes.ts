import { Response, Router } from 'express';

import { STATUS_CODE } from '../utils/status.code';
import { TypeRequestBody } from '../types/req-res.types';
import { LoginInputModel } from '../models/users.models';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { authLoginRequestBodySchema } from '../validation/auth_login/auth.login.request.body.schema';
import { userService } from '../service/users.service';

export const authgRouter = Router();

authgRouter.post(
  '/',
  authLoginRequestBodySchema,
  validateRequestMiddleware,
  async (req: TypeRequestBody<LoginInputModel>, res: Response) => {
    const { loginOrEmail, password } = req.body;

    const user = await userService.checkCredentials(loginOrEmail, password);

    if (!user) return res.sendStatus(STATUS_CODE.Unauthorized);

    return res.sendStatus(STATUS_CODE.NOT_CONTENT);
  }
);
