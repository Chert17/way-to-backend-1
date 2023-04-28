import { Request, Response } from 'express';

import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from '../service/posts.service';
import { PostInputModel, PostViewModel } from '../models/posts.models';
import { STATUS_CODE } from '../utils/status.code';
import {
  TypeRequestBody,
  TypeRequestParams,
  TypeRequestParamsAndBody,
} from '../types/req-res.types';
import { IPost } from '../types/post.interface';
import { getBlogById } from '../service/blogs.service';

export const getAllPostsController = async (
  req: Request,
  res: Response<PostViewModel[]>
) => {
  const posts = await getAllPosts();

  return res.status(STATUS_CODE.OK).json(posts);
};

export const getPostByIdController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response<PostViewModel>
) => {
  const post = await getPostById(req.params.id);

  if (!post) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  return res.status(STATUS_CODE.OK).json(post);
};

export const postPostController = async (
  req: TypeRequestBody<PostInputModel>,
  res: Response<PostViewModel>
) => {
  const { blogId, content, shortDescription, title } = req.body;

  //!
  //TODO: спросить за последовательность ,   можно ли обьеденить в один if !blogId & !blog ?
  //!

  if (!blogId) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  const blog = await getBlogById(blogId);

  if (!blog) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  const newPost: IPost = {
    id: Date.now().toString(),
    blogId,
    content,
    shortDescription,
    title,
    blogName: blog.name,
  };

  const post = await createPost(newPost);

  return res.status(STATUS_CODE.CREATED).json(post);
};

export const updatePostController = async (
  req: TypeRequestParamsAndBody<{ id: string }, PostInputModel>,
  res: Response
) => {
  const post = await updatePost(req.params.id, req.body);

  if (!post) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
};

export const deletePostController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response
) => {
  const post = await deletePost(req.params.id);

  if (!post) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
};
