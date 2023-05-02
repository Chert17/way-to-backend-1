import { ObjectId } from 'mongodb';

import { postsDbCollection } from '../db/db.collections';
import { PostInputModel } from '../models/posts.models';
import { IPostDb } from '../db/db.types';
import { postRepo } from '../repositories/posts/post.repo';
import { blogQueryRepo } from '../repositories/blogs/blog.query.repo';

export const postService = {
  createPost: async ({
    blogId,
    content,
    shortDescription,
    title,
  }: PostInputModel): Promise<ObjectId | null> => {
    const blog = await blogQueryRepo.getBlogById(blogId);

    if (!blog) return null;

    const newPost: IPostDb = {
      blogId: blog.id,
      content,
      shortDescription,
      title,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    return await postRepo.createPost(newPost);
  },

  updatePost: async (id: string, body: PostInputModel): Promise<boolean> => {
    const { blogId, content, shortDescription, title } = body;

    return await postRepo.updatePost({
      id,
      blogId,
      content,
      shortDescription,
      title,
    });
  },

  deletePost: async (id: string): Promise<boolean> => {
    return await postRepo.deletePost(id);
  },
};
