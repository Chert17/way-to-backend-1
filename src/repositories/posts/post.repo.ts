import { ObjectId } from 'mongodb';

import { postsDbCollection } from '../../db/db.collections';
import { IPostDb } from '../../db/db.types';
import { PostInputModel } from '../../models/posts.models';

export const postRepo = {
  createPost: async (post: IPostDb): Promise<ObjectId | null> => {
    const result = await postsDbCollection.insertOne(post);

    if (!result.acknowledged) return null;

    return result.insertedId;
  },

  updatePost: async (
    post: PostInputModel & { id: string }
  ): Promise<boolean> => {
    const { id, blogId, content, shortDescription, title } = post;

    const result = await postsDbCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { blogId, content, shortDescription, title } },
      { returnDocument: 'after' }
    );

    return !!result.value;
  },

  deletePost: async (id: string): Promise<boolean> => {
    const result = await postsDbCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    return !!result.value;
  },
};
