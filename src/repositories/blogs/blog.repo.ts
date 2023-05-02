import { ObjectId } from 'mongodb';

import { blogsDbCollection } from '../../db/db.collections';
import { IBlogDb } from '../../db/db.types';
import { BlogInputModel } from '../../models/blogs.models';

export const blogRepo = {
  createBlog: async (blog: IBlogDb): Promise<ObjectId | null> => {
    const result = await blogsDbCollection.insertOne(blog);

    if (!result.acknowledged) return null;

    return result.insertedId;
  },

  updateBlog: async (
    blog: BlogInputModel & { id: string }
  ): Promise<boolean> => {
    const { name, description, websiteUrl, id } = blog;

    const result = await blogsDbCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, description, websiteUrl } },
      { returnDocument: 'after' }
    );

    return !!result.value;
  },

  deleteBlog: async (id: string): Promise<boolean> => {
    const result = await blogsDbCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    return !!result.value;
  },
};
