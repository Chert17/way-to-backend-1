import { Filter, ObjectId } from 'mongodb';

import { blogsDbCollection } from '../../db/db.collections';
import { BlogViewModel } from '../../models/blogs.models';
import { IWithPagination } from '../../types/pagination.interface';
import { converterToBlogValidFormat } from '../../helpers/converterToValidFormatData/converter.blog';
import { IBlogDb } from '../../db/db.types';
import { TypeValidRequestQueryParams } from '../../types/req-res.types';

export const blogQueryRepo = {
  getAllBlogs: async (
    data: TypeValidRequestQueryParams
  ): Promise<IWithPagination<BlogViewModel>> => {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      data;

    const filter: Filter<IBlogDb> = {
      name: { $regex: searchNameTerm, $options: 'i' },
    };
    const blogs = await blogsDbCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogsDbCollection.countDocuments(filter);

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pagesCount === 0 ? 1 : pagesCount,
      pageSize: pageSize,
      page: pageNumber,
      totalCount,
      items: blogs.map(converterToBlogValidFormat),
    };
  },

  getBlogById: async (id: string): Promise<BlogViewModel | null> => {
    const blog = await blogsDbCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) return null;

    return converterToBlogValidFormat(blog);
  },

  // _getBlogs: async (
  //   data: TypeValidRequestQueryParams
  // ): Promise<IWithPagination<BlogViewModel>> => {
  //   const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
  //     data;

  //   const filter: Filter<IBlogDb> = {
  //     name: { $regex: searchNameTerm, $options: 'i' },
  //   };
  //   const blogs = await blogsDbCollection
  //     .find(filter)
  //     .sort(sortBy, sortDirection)
  //     .skip((pageNumber - 1) * pageSize)
  //     .limit(pageSize)
  //     .toArray();

  //   const totalCount = await blogsDbCollection.countDocuments(filter);

  //   const pagesCount = Math.ceil(totalCount / pageSize);

  //   return {
  //     pagesCount: pagesCount === 0 ? 1 : pagesCount,
  //     pageSize: pageSize,
  //     page: pageNumber,
  //     totalCount,
  //     items: blogs.map(converterToBlogValidFormat),
  //   };
  // },
};
