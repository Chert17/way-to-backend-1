import { ObjectId } from 'mongodb';

import { postsDbCollection } from '../../db/db.collections';
import { PostViewModel } from '../../models/posts.models';
import { IWithPagination } from '../../types/pagination.interface';
import { converterToPostValidFormat } from '../../helpers/converterToValidFormatData/converter.post';
import { ValidPaginationQueryParams } from '../../types/req-res.types';

export const postQueryRepo = {
  async getAllPosts(
    // condition: string,
    pagination: ValidPaginationQueryParams
  ): Promise<IWithPagination<PostViewModel>> {
    return this._getPosts({ ...pagination, condition: '' });
  },

  getPostById: async (id: string): Promise<PostViewModel | null> => {
    if (!ObjectId.isValid(id)) return null;

    const post = await postsDbCollection.findOne({ _id: new ObjectId(id) });

    if (!post) return null;

    return converterToPostValidFormat(post);
  },

  async getAllPostsByOneBlog(
    blogId: string,
    pagination: ValidPaginationQueryParams
  ): Promise<IWithPagination<PostViewModel>> {
    return await this._getPosts({ ...pagination, condition: blogId });
  },

  _getPosts: async (
    filter: ValidPaginationQueryParams & { condition: string }
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

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize,
      page,
      totalCount,
      items: posts.map(converterToPostValidFormat),
    };
  },
};
