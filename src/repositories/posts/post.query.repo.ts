import { ObjectId } from 'mongodb';

import { postsDbCollection } from '../../db/db.collections';
import { PostViewModel } from '../../models/posts.models';
import { IWithPagination } from '../../types/pagination.interface';
import { converterToPostValidFormat } from '../../helpers/converterToValidFormatData/converter.post';
import { TypeValidQueryParams } from '../../types/req-res.types';

export const postQueryRepo = {
  async getAllPosts(
    filter: TypeValidQueryParams
  ): Promise<IWithPagination<PostViewModel>> {
    return this._getPosts({ ...filter, condition: '' });
  },

  getPostById: async (id: string): Promise<PostViewModel | null> => {
    const post = await postsDbCollection.findOne({ _id: new ObjectId(id) });

    if (!post) return null;

    return converterToPostValidFormat(post);
  },

  async getAllPostsByOneBlog(
    blogId: string,
    filter: TypeValidQueryParams
  ): Promise<IWithPagination<PostViewModel>> {
    return await this._getPosts({ ...filter, condition: blogId });
  },

  _getPosts: async (
    filter: TypeValidQueryParams
  ): Promise<IWithPagination<PostViewModel>> => {
    const { condition, page, pageSize, sortBy, sortDirection } = filter;

    const find = condition
      ? { blogId: { $regex: condition, $options: 'i' } }
      : {};

    const posts = await postsDbCollection
      .find(find)
      .sort(sortBy, sortDirection)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await postsDbCollection.countDocuments(find);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize,
      page,
      totalCount,
      items: posts.map(converterToPostValidFormat),
    };
  },
};
