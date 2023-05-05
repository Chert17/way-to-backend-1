import { ObjectId } from 'mongodb';

import { commentsDbCollection } from '../../db/db.collections';
import { ICommentsDb } from '../../db/db.types';

export const commentRepo = {
  createComment: async (newComment: ICommentsDb): Promise<ObjectId | null> => {
    const result = await commentsDbCollection.insertOne(newComment);

    if (!result.acknowledged) return null;

    return result.insertedId;
  },

  updateComment: async (
    commentId: string,
    content: string
  ): Promise<boolean> => {
    if (!ObjectId.isValid(commentId)) return false;

    const result = await commentsDbCollection.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      { $set: { content } },
      { returnDocument: 'after' }
    );

    return !!result.value;
  },

  deleteComment: async (commentId: string): Promise<boolean> => {
    if (!ObjectId.isValid(commentId)) return false;

    const result = await commentsDbCollection.findOneAndDelete({
      _id: new ObjectId(commentId),
    });

    return !!result.value;
  },
};
