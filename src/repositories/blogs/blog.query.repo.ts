import { ObjectId } from 'mongodb';

import { blogsDbCollection } from '../../db/db.collections';
import { BlogViewModel } from '../../models/blogs.models';
import { IWithPagination } from '../../types/pagination.interface';
import { converterToBlogValidFormat } from '../../helpers/converterToValidFormatData/converter.blog';
import { ValidPaginationQueryParams } from '../../types/req-res.types';

export const blogQueryRepo = {
  async getAllBlogs(
    condition: string,
    pagination: ValidPaginationQueryParams
  ): Promise<IWithPagination<BlogViewModel>> {
    return this._getBlogs({ ...pagination, condition });
  },

  getBlogById: async (id: string): Promise<BlogViewModel | null> => {
    const blog = await blogsDbCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) return null;

    return converterToBlogValidFormat(blog);
  },

  _getBlogs: async (
    filter: ValidPaginationQueryParams & { condition: string }
  ): Promise<IWithPagination<BlogViewModel>> => {
    const { condition, page, pageSize, sortBy, sortDirection } = filter;

    const find = { name: { $regex: condition, $options: 'i' } };

    const blogs = await blogsDbCollection
      .find(find)
      .sort(sortBy, sortDirection)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogsDbCollection.countDocuments(find);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize,
      page,
      totalCount,
      items: blogs.map(converterToBlogValidFormat),
    };
  },
};
