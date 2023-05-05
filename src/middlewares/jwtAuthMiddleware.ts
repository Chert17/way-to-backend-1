import { Request, Response, NextFunction } from 'express';
import { STATUS_CODE } from '../utils/status.code';
import { jwtService } from '../application/jwt.service';
import { userQueryRepo } from '../repositories/users/user.query.repo';

export const jwtAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqAuth = req.headers.authorization;

  if (!reqAuth) {
    res.sendStatus(STATUS_CODE.UNAUTHORIZED);
    return;
  }

  const [atuhType, token] = reqAuth.split(' ');

  if (atuhType !== 'Bearer') {
    res.sendStatus(STATUS_CODE.UNAUTHORIZED);
    return;
  }

  const userId = await jwtService.getUSerIdByToken(token);

  if (!userId) {
    res.sendStatus(STATUS_CODE.UNAUTHORIZED);
    return;
  }

  const user = await userQueryRepo.getUserById(userId.toString());

  if (!user) {
    res.sendStatus(STATUS_CODE.BAD_REQUEST);
    return;
  }

  req.userId = user.id;
  next();
};
