import { ObjectId, WithId } from 'mongodb';

import { IWithPagination } from '../../types/pagination.interface';
import { ValidPaginationQueryParams } from '../../types/req-res.types';
import { UserViewModel } from '../../models/users.models';
import { usersDbCollection } from '../../db/db.collections';
import { converterToUserValidFormat } from '../../helpers/converterToValidFormatData/converter.user';
import { IUserDb } from '../../db/db.types';

export const userQueryRepo = {
  async getAllUsers(
    condition: { login: string; email: string },
    pagination: ValidPaginationQueryParams
  ): Promise<IWithPagination<UserViewModel>> {
    const { email, login } = condition;

    return this._getUsers({ ...pagination, email, login });
  },

  getUserById: async (id: string): Promise<UserViewModel | null> => {
    const user = await usersDbCollection.findOne({ _id: new ObjectId(id) });

    if (!user) return null;

    return converterToUserValidFormat(user);
  },

  checkUserCredentials: async (
    loginOrEmail: string
  ): Promise<WithId<IUserDb> | null> => {
    const user = await usersDbCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });

    if (!user) return null;

    return user;
  },

  _getUsers: async (
    filter: ValidPaginationQueryParams & { email: string } & {
      login: string;
    }
  ): Promise<IWithPagination<UserViewModel>> => {
    const { email, login, page, pageSize, sortBy, sortDirection } = filter;

    const query: Record<string, unknown> = {};
    if (email) query.email = { $regex: email, $options: 'i' };

    if (login) query.login = { $regex: login, $options: 'i' };

    const find = { $or: [query] };

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
