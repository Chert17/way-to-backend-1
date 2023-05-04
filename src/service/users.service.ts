import { ObjectId } from 'mongodb';
import { genSalt } from 'bcrypt';

import { IUserDb } from '../db/db.types';
import { UserInputModel } from '../models/users.models';
import { userRepo } from '../repositories/users/user.repo';
import { generateHash } from '../helpers/generate.hash';
import { userQueryRepo } from '../repositories/users/user.query.repo';

export const userService = {
  createUser: async ({
    email,
    login,
    password,
  }: UserInputModel): Promise<ObjectId | null> => {
    const passwordSalt = await genSalt(10);
    const passwordHash = await generateHash(password, passwordSalt);

    const newUser: IUserDb = {
      login,
      email,
      passwordHash,
      passwordSalt,
      createdAt: new Date().toISOString(),
    };

    return await userRepo.createUser(newUser);
  },

  deleteUser: async (id: string): Promise<boolean> => {
    return await userRepo.deleteUser(id);
  },

  checkCredentials: async (
    loginOrEmail: string,
    password: string
  ): Promise<true | null> => {
    const user = await userQueryRepo.checkUserCredentials(loginOrEmail);

    if (!user) return null;

    const passwordHash = await generateHash(password, user.passwordSalt);

    if (passwordHash !== user.passwordHash) return null;

    return true;
  },
};
