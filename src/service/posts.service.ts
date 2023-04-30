import { ObjectId } from 'mongodb';
import { postsDbCollection } from '../db/db.collections';
import { PostInputModel, PostViewModel } from '../models/posts.models';
import { IPost } from '../types/post.interface';

export const getAllPosts = async (): Promise<PostViewModel[]> => {
  const posts = await postsDbCollection.find().toArray();

  return posts.map(post => ({
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  }));
};

export const getPostById = async (
  id: string
): Promise<PostViewModel | null> => {
  const post = await postsDbCollection.findOne({ _id: new ObjectId(id) });

  if (!post) return null;

  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
};

export const createPost = async (
  post: IPost
): Promise<PostViewModel | null> => {
  const result = await postsDbCollection.insertOne(post);

  if (!result.acknowledged) return null;

  return {
    id: result.insertedId.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
};

export const updatePost = async (
  id: string,
  body: PostInputModel
): Promise<boolean> => {
  const { blogId, content, shortDescription, title } = body;

  const post = await postsDbCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { blogId, content, shortDescription, title } },
    { returnDocument: 'after' }
  );

  return !!post.value;
};

export const deletePost = async (id: string): Promise<boolean> => {
  const post = await postsDbCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });

  return !!post.value;
};
