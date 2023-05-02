import { IBlogDb } from '../db/db.types';
import { BlogInputModel, BlogViewModel } from '../models/blogs.models';
import { blogRepo } from '../repositories/blogs/blog.repo';

export const blogService = {
  createBlog: async ({
    name,
    description,
    websiteUrl,
  }: BlogInputModel): Promise<BlogViewModel | null> => {
    const newBlog: IBlogDb = {
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    return await blogRepo.createBlog(newBlog);
  },

  updateBlog: async (id: string, body: BlogInputModel): Promise<boolean> => {
    const { name, description, websiteUrl } = body;

    return await blogRepo.updateBlog({
      id,
      name,
      description,
      websiteUrl,
    });
  },

  deleteBlog: async (id: string): Promise<boolean> => {
    return await blogRepo.deleteBlog(id);
  },
};
