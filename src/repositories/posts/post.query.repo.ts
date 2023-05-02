import { Filter, ObjectId } from 'mongodb';

import { postsDbCollection } from '../../db/db.collections';
import { PostViewModel } from '../../models/posts.models';
import { IWithPagination } from '../../types/pagination.interface';
import { converterToPostValidFormat } from '../../helpers/converterToValidFormatData/converter.post';
import { IPostDb } from '../../db/db.types';
import { TypeValidRequestQueryParams } from '../../types/req-res.types';

export const postQueryRepo = {
  getAllPosts: async (
    data: TypeValidRequestQueryParams
  ): Promise<IWithPagination<PostViewModel>> => {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      data;

    const filter: Filter<IPostDb> = {
      name: { $regex: searchNameTerm, $options: 'i' },
    };
    const posts = await postsDbCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await postsDbCollection.countDocuments(filter);

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pagesCount === 0 ? 1 : pagesCount,
      pageSize: pageSize,
      page: pageNumber,
      totalCount,
      items: posts.map(converterToPostValidFormat),
    };
  },

  getPostById: async (id: string): Promise<PostViewModel | null> => {
    const post = await postsDbCollection.findOne({ _id: new ObjectId(id) });

    if (!post) return null;

    return converterToPostValidFormat(post);
  },

  getAllPostsByOneBlog: async (
    blogId: string,
    data: Omit<TypeValidRequestQueryParams, 'searchNameTerm'>
  ): Promise<IWithPagination<PostViewModel>> => {
    const { pageNumber, pageSize, sortBy, sortDirection } = data;

    const filter: Filter<IPostDb> = {
      name: { $regex: blogId, $options: 'i' },
    };

    const posts = await postsDbCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await postsDbCollection.countDocuments(filter);

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pagesCount === 0 ? 1 : pagesCount,
      pageSize: pageSize,
      page: pageNumber,
      totalCount,
      items: posts.map(converterToPostValidFormat),
    };
  },
};
