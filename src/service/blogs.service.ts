import { ObjectId } from 'mongodb';
import { blogsDbCollection } from '../db/db.collections';
import { IBlogDb } from '../db/db.types';
import { BlogInputModel, BlogViewModel } from '../models/blogs.models';

export const getAllBlogs = async (): Promise<BlogViewModel[]> => {
  const blogs = await blogsDbCollection.find().toArray();

  return blogs.map(blog => ({
    id: blog._id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  }));
};

export const getBlogById = async (
  id: string
): Promise<BlogViewModel | null> => {
  const blog = await blogsDbCollection.findOne({ _id: new ObjectId(id) });

  if (!blog) return null;

  return {
    id: blog._id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};

export const createBlog = async (
  blog: IBlogDb
): Promise<BlogViewModel | null> => {
  const result = await blogsDbCollection.insertOne(blog);

  if (!result.acknowledged) return null;

  return {
    id: result.insertedId,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};

export const updateBlog = async (
  id: string,
  body: BlogInputModel
): Promise<true | null> => {
  const { name, description, websiteUrl } = body;

  return !!(await blogsDbCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { name, description, websiteUrl } },
    { returnDocument: 'after' }
  ));
};

export const deleteBlog = async (id: string): Promise<true | null> => {
  return !!(await blogsDbCollection.findOneAndDelete({
    _id: new ObjectId(id),
  }));
};
