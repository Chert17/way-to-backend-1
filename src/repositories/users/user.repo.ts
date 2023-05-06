import { ObjectId } from 'mongodb';
import {
  emailConfirmationByUserDbCollection,
  usersDbCollection,
} from '../../db/db.collections';
import { IEmailConfirmByUserDb, IUserDb } from '../../db/db.types';

export const userRepo = {
  createUser: async (user: IUserDb): Promise<ObjectId | null> => {
    const result = await usersDbCollection.insertOne(user);

    if (!result.acknowledged) return null;

    return result.insertedId;
  },

  emailConfirmationByUser: async (
    emailConfirmation: IEmailConfirmByUserDb
  ): Promise<ObjectId | null> => {
    const result = await emailConfirmationByUserDbCollection.insertOne(
      emailConfirmation
    );

    if (!result.acknowledged) return null;

    return result.insertedId;
  },

  updateEmailConfirmStatus: async (id: string): Promise<true | null> => {
    if (!ObjectId.isValid(id)) return null;

    const result = await emailConfirmationByUserDbCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isConfirm: true } },
      { returnDocument: 'after' }
    );

    if (!result.value) return null;

    return true;
  },

  deleteEmailConfirmByUser: async (id: string) => {
    if (!ObjectId.isValid(id)) return null;

    const result = await emailConfirmationByUserDbCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    return !!result.value;
  },

  deleteUser: async (id: string): Promise<boolean> => {
    if (!ObjectId.isValid(id)) return false;

    const result = await usersDbCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    return !!result.value;
  },
};
