import { ObjectId } from 'mongodb';

import { blogsDbCollection } from '../../db/db.collections';
import { BlogViewModel } from '../../models/blogs.models';
import { IWithPagination } from '../../types/pagination.interface';
import { converterToBlogValidFormat } from '../../helpers/converterToValidFormatData/converter.blog';

export const blogQueryRepo = {
  getAllBlogs: async (): Promise<IWithPagination<BlogViewModel>> => {
    const blogs = await blogsDbCollection.find().toArray();

    return {
      pagesCount: 0,
      pageSize: 0,
      page: 0,
      totalCount: 0,
      items: blogs.map(blog => converterToBlogValidFormat(blog)),
    };
  },

  getBlogById: async (id: string): Promise<BlogViewModel | null> => {
    const blog = await blogsDbCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) return null;

    return converterToBlogValidFormat(blog);
  },
};
