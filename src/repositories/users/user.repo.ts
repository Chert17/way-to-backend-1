import { ObjectId } from 'mongodb';
import { usersDbCollection } from '../../db/db.collections';
import { IUserDb } from '../../db/db.types';

export const userRepo = {
  createUser: async (user: IUserDb): Promise<ObjectId | null> => {
    const result = await usersDbCollection.insertOne(user);

    if (!result.acknowledged) return null;

    return result.insertedId;
  },

  deleteUser: async (id: string): Promise<boolean> => {
    if (!ObjectId.isValid(id)) return false;

    const result = await usersDbCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    return !!result.value;
  },
};
