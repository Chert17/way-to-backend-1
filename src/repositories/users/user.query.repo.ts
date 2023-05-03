import { ObjectId } from 'mongodb';

import { IWithPagination } from '../../types/pagination.interface';
import { ValidPaginationQueryParams } from '../../types/req-res.types';
import { UserViewModel } from '../../models/users.models';
import { usersDbCollection } from '../../db/db.collections';
import { converterToUserValidFormat } from '../../helpers/converterToValidFormatData/converter.user';

export const userQueryRepo = {
  async getAllUsers(
    condition: { login: string; email: string },
    pagination: ValidPaginationQueryParams
  ): Promise<IWithPagination<UserViewModel>> {
    const { email, login } = condition;

    return this._getUsers({ ...pagination, email, login });
  },

  _getUsers: async (
    filter: ValidPaginationQueryParams & { email: string } & {
      login: string;
    }
  ): Promise<IWithPagination<UserViewModel>> => {
    const { email, login, page, pageSize, sortBy, sortDirection } = filter;

    const find = { $or: [{ email }, { login }] };

    const users = await usersDbCollection
      .find(find)
      .sort(sortBy, sortDirection)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await usersDbCollection.countDocuments(find);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize,
      page,
      totalCount,
      items: users.map(converterToUserValidFormat),
    };
  },
};
