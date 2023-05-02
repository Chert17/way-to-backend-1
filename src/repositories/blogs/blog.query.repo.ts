import { ObjectId } from 'mongodb';

import { blogsDbCollection } from '../../db/db.collections';
import { BlogViewModel } from '../../models/blogs.models';
import { IWithPagination } from '../../types/pagination.interface';

export const blogQueryRepo = {
  getAllBlogs: async (): Promise<IWithPagination<BlogViewModel>> => {
    const blogs = await blogsDbCollection.find().toArray();

    return {
      pagesCount: 0,
      pageSize: 0,
      page: 0,
      totalCount: 0,
      items: blogs.map(blog => ({
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      })),
    };
  },

  getBlogById: async (id: string): Promise<BlogViewModel | null> => {
    const blog = await blogsDbCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) return null;

    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  },
};
