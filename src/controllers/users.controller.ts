import { Response } from 'express';

import {
  PaginationQueryParams,
  TypeRequestQuery,
} from '../types/req-res.types';
import { IWithPagination } from '../types/pagination.interface';
import { UserViewModel } from '../models/users.models';
import { paginationQueryParamsValidation } from '../helpers/request.query.params.validation';
import { requestConditionValidation } from '../helpers/request.query.condition.validation';
import { userQueryRepo } from '../repositories/users/user.query.repo';
import { STATUS_CODE } from '../utils/status.code';

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

export const getUserByIdController = () => {};

export const deleteUserController = () => {};
