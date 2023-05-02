import { ObjectId } from 'mongodb';

import { postsDbCollection } from '../../db/db.collections';
import { PostViewModel } from '../../models/posts.models';
import { IWithPagination } from '../../types/pagination.interface';
import { converterToPostValidFormat } from '../../helpers/converterToValidFormatData/converter.post';

export const postQueryRepo = {
  getAllPosts: async (): Promise<IWithPagination<PostViewModel>> => {
    const posts = await postsDbCollection.find().toArray();

    return {
      pagesCount: 0,
      pageSize: 0,
      page: 0,
      totalCount: 0,
      items: posts.map(post => converterToPostValidFormat(post)),
    };
  },

  getPostById: async (id: string): Promise<PostViewModel | null> => {
    const post = await postsDbCollection.findOne({ _id: new ObjectId(id) });

    if (!post) return null;

    return converterToPostValidFormat(post);
  },

  getAllPostsByOneBlog: async (
    blogId: string
  ): Promise<IWithPagination<PostViewModel>> => {
    const posts = await postsDbCollection.find({ blogId: blogId }).toArray();

    return {
      pagesCount: 0,
      pageSize: 0,
      page: 0,
      totalCount: 0,
      items: posts.map(post => converterToPostValidFormat(post)),
    };
  },
};
