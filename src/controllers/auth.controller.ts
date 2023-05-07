import { Request, Response } from 'express';

import { jwtService } from '../application/jwt.service';
import { MeViewMOdel, RegisterInputModel } from '../models/auth.models';
import { LoginInputModel } from '../models/users.models';
import { userQueryRepo } from '../repositories/users/user.query.repo';
import { userService } from '../service/users.service';
import { TypeRequestBody } from '../types/req-res.types';
import { STATUS_CODE } from '../utils/status.code';
import { authService } from '../service/auth.service';

export const loginController = async (
  req: TypeRequestBody<LoginInputModel>,
  res: Response
) => {
  const { loginOrEmail, password } = req.body;

  const user = await userService.checkCredentials(loginOrEmail, password);

  if (!user) return res.sendStatus(STATUS_CODE.UNAUTHORIZED);

  const isConfirmUserByEmail = await userQueryRepo.getEmailConfirmationByUserId(
    user._id.toString()
  );

  if (!isConfirmUserByEmail) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // user emailConfirm not found in base

  if (!isConfirmUserByEmail.isConfirm) {
    return res.sendStatus(STATUS_CODE.UNAUTHORIZED); // user failed email verification check
  }

  const accessToken = await jwtService.createJWT(user._id);

  return res.status(STATUS_CODE.OK).json({ accessToken });
};

export const getMeController = async (req: Request, res: Response) => {
  if (!req.userId) return res.sendStatus(STATUS_CODE.BAD_REQUEST);

  const user = await userQueryRepo.getUserById(req.userId!);

  if (!user) return res.sendStatus(STATUS_CODE.BAD_REQUEST);

  const viewUser: MeViewMOdel = {
    userId: user.id,
    login: user.login,
    email: user.email,
  };

  return res.status(STATUS_CODE.OK).json(viewUser);
};

export const registrationController = async (
  req: TypeRequestBody<RegisterInputModel>,
  res: Response
) => {
  const { email, login, password } = req.body;

  const isAlreadyUserByEmail = await userService.checkCredentials(
    email,
    password
  );
  const isAlreadyUserByLogin = await userService.checkCredentials(
    login,
    password
  );

  if (isAlreadyUserByEmail) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      errorsMessages: [{ message: 'Inccorect field', field: 'email' }],
    });
  }

  if (isAlreadyUserByLogin) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      errorsMessages: [{ message: 'Inccorect field', field: 'login' }],
    });
  }

  const userId = await userService.createUser({ email, login, password });

  if (!userId) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // not created user

  const emailConfirmationCode = await authService.emailConfirmationByUser(
    userId.toString()
  );

  if (!emailConfirmationCode) {
    await userService.deleteUser(userId.toString());
    return res.sendStatus(STATUS_CODE.BAD_REQUEST); // emailConfirmation failed
  }

  const resultMessage = await authService.sendEmail(
    email,
    emailConfirmationCode
  );

  if (!resultMessage) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // message not sent , need repeat

  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
};

export const registerationConfirmationController = async (
  req: TypeRequestBody<{ code: string }>,
  res: Response
) => {
  const result = await authService.checkConfirmEmail(req.body.code);

  if (!result)
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      errorsMessages: [{ message: 'Inncorect field', field: 'code' }],
    }); // codes not match

  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
};

export const emailResendingController = async (
  req: TypeRequestBody<{ email: string }>,
  res: Response
) => {
  const user = await userQueryRepo.checkUserCredentials(req.body.email);

  if (!user) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      errorsMessages: [{ message: 'Inncorect field', field: 'email' }],
    }); // user not found
  }

  const emailConfirmCode = await userQueryRepo.getEmailConfirmationByUserId(
    user._id.toString()
  );

  if (!emailConfirmCode) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // code not found by this user

  if (emailConfirmCode.isConfirm === true) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      errorsMessages: [{ message: 'Inncorect field', field: 'email' }],
    }); // user already confirmed
  }

  const resultMessage = await authService.sendEmail(
    user.email,
    emailConfirmCode.confirmationCode
  );

  if (!resultMessage) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // message not sent , need repeat

  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
};
