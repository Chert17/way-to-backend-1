import { ObjectId } from 'mongodb';

import { commentsDbCollection } from '../../db/db.collections';
import { ICommentsDb } from '../../db/db.types';

export const commentRepo = {
  createComment: async (newComment: ICommentsDb): Promise<ObjectId | null> => {
    const result = await commentsDbCollection.insertOne(newComment);

    if (!result.acknowledged) return null;

    return result.insertedId;
  },
};
