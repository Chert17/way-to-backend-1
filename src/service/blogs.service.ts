import { BlogInputModel } from '../models/blogs.models';
import { IBlog } from '../types/blog.interface';
import { blogsData } from '../utils/blogs.data';

export const getAllBlogs = async () => {
  return blogsData;
};

export const getBlogById = async (id: string) => {
  const blog = blogsData.find(item => item.id === id);

  if (!blog) return false;

  return blog;
};

export const createBlog = async (blog: IBlog) => {
  blogsData.unshift(blog);
  return blog;
};

export const updateBlog = async (id: string, body: BlogInputModel) => {
  const { name, description, websiteUrl } = body;

  const blog = blogsData.find(item => item.id === id);

  if (!blog) return false;

  blog.name = name;
  blog.description = description;
  blog.websiteUrl = websiteUrl;

  return blog;
};

export const deleteBlog = async (id: string) => {
  const idx = blogsData.findIndex(item => item.id === id);
  if (idx === -1) return false;

  blogsData.splice(idx, 1);

  return true;
};
