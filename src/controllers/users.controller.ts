import { Response } from 'express';

import {
  PaginationQueryParams,
  TypeRequestQuery,
  TypeRequestBody,
  TypeRequestParams,
} from '../types/req-res.types';
import { IWithPagination } from '../types/pagination.interface';
import { UserInputModel, UserViewModel } from '../models/users.models';
import { paginationQueryParamsValidation } from '../helpers/request.query.params.validation';
import { requestConditionValidation } from '../helpers/request.query.condition.validation';
import { userQueryRepo } from '../repositories/users/user.query.repo';
import { STATUS_CODE } from '../utils/status.code';
import { userService } from '../service/users.service';

export const getAllUsersController = async (
  req: TypeRequestQuery<
    PaginationQueryParams & { searchLoginTerm: string; searchEmailTerm: string }
  >,
  res: Response<IWithPagination<UserViewModel>>
) => {
  const { searchEmailTerm, searchLoginTerm } = req.query;

  const queryParams = paginationQueryParamsValidation(req.query);

  const login = requestConditionValidation(searchLoginTerm, '');
  const email = requestConditionValidation(searchEmailTerm, '');

  const users = await userQueryRepo.getAllUsers({ login, email }, queryParams);

  return res.status(STATUS_CODE.OK).json(users);
};

export const createUserController = async (
  req: TypeRequestBody<UserInputModel>,
  res: Response<UserViewModel>
) => {
  const { email, login, password } = req.body;

  const userId = await userService.createUser({ email, login, password });

  if (!userId) return res.sendStatus(STATUS_CODE.BAD_REQUEST);

  const user = await userQueryRepo.getUserById(userId.toString());

  if (!user) return res.status(STATUS_CODE.BAD_REQUEST);

  return res.status(STATUS_CODE.CREATED).json(user);
};

export const deleteUserController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response
) => {
  const userId = await userQueryRepo.getUserById(req.params.id);

  if (!userId) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  await userService.deleteUser(req.params.id);

  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
};
