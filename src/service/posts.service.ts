import { PostInputModel } from '../models/posts.models';
import { IPost } from '../types/post.interface';
import { postsData } from '../utils/posts.data';

export const getAllPosts = async () => {
  return postsData;
};

export const getPostById = async (id: string) => {
  const post = postsData.find(item => item.id === id);

  if (!post) return false;

  return post;
};

export const createPost = async (post: IPost) => {
  postsData.unshift(post);
  return post;
};

export const updatePost = async (id: string, body: PostInputModel) => {
  const { blogId, content, shortDescription, title } = body;

  const post = postsData.find(item => item.id === id);

  if (!post) return false;

  post.blogId = blogId;
  post.content = content;
  post.shortDescription = shortDescription;
  post.title = title;

  return post;
};

export const deletePost = async (id: string) => {
  const idx = postsData.findIndex(item => item.id === id);
  if (idx === -1) return false;

  postsData.splice(idx, 1);

  return true;
};
