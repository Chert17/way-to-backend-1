import { Response, Router, Request } from 'express';

import { STATUS_CODE } from '../utils/status.code';
import { TypeRequestBody } from '../types/req-res.types';
import { LoginInputModel, MeViewMOdel } from '../models/auth.models';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { authLoginRequestBodySchema } from '../validation/auth_login/auth.login.request.body.schema';
import { userService } from '../service/users.service';
import { jwtService } from '../application/jwt.service';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware';
import { userQueryRepo } from '../repositories/users/user.query.repo';

export const authgRouter = Router();

authgRouter.post(
  '/login',
  authLoginRequestBodySchema,
  validateRequestMiddleware,
  async (req: TypeRequestBody<LoginInputModel>, res: Response) => {
    const { loginOrEmail, password } = req.body;

    const user = await userService.checkCredentials(loginOrEmail, password);

    if (!user) return res.sendStatus(STATUS_CODE.UNAUTHORIZED);

    const accessToken = await jwtService.createJWT(user._id);

    return res.status(STATUS_CODE.OK).json({ accessToken });
  }
);

authgRouter.get(
  '/me',
  jwtAuthMiddleware,
  async (req: Request, res: Response) => {
    if (!req.userId) return res.sendStatus(STATUS_CODE.BAD_REQUEST);

    const user = await userQueryRepo.getUserById(req.userId!);

    if (!user) return res.sendStatus(STATUS_CODE.BAD_REQUEST);

    const viewUser: MeViewMOdel = {
      userId: user.id,
      login: user.login,
      email: user.email,
    };

    return res.status(STATUS_CODE.OK).json(viewUser);
  }
);
