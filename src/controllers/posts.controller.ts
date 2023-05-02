import { Request, Response } from 'express';

import { postService } from '../service/posts.service';
import { PostInputModel, PostViewModel } from '../models/posts.models';
import { STATUS_CODE } from '../utils/status.code';
import {
  TypeRequestBody,
  TypeRequestParams,
  TypeRequestParamsAndBody,
} from '../types/req-res.types';

import { postQueryRepo } from '../repositories/posts/post.query.repo';
import { IWithPagination } from '../types/pagination.interface';

export const getAllPostsController = async (
  req: Request,
  res: Response<IWithPagination<PostViewModel>>
) => {
  const posts = await postQueryRepo.getAllPosts();

  return res.status(STATUS_CODE.OK).json(posts);
};

export const getPostByIdController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response<PostViewModel>
) => {
  const post = await postQueryRepo.getPostById(req.params.id);

  if (!post) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  return res.status(STATUS_CODE.OK).json(post);
};

export const createPostController = async (
  req: TypeRequestBody<PostInputModel>,
  res: Response<PostViewModel>
) => {
  const { blogId, content, shortDescription, title } = req.body;

  if (!blogId) return res.sendStatus(STATUS_CODE.BAD_REQUEST);

  const postId = await postService.createPost({
    blogId,
    content,
    shortDescription,
    title,
  });

  if (!postId) return res.sendStatus(STATUS_CODE.BAD_REQUEST);

  const post = await postQueryRepo.getPostById(postId.toString());

  if (!post) return res.status(STATUS_CODE.BAD_REQUEST);

  return res.status(STATUS_CODE.CREATED).json(post);
};

export const updatePostController = async (
  req: TypeRequestParamsAndBody<{ id: string }, PostInputModel>,
  res: Response
) => {
  const postId = await postQueryRepo.getPostById(req.params.id);

  if (!postId) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  await postService.updatePost(postId.id, req.body);

  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
};

export const deletePostController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response
) => {
  const postId = await postQueryRepo.getPostById(req.params.id);

  if (!postId) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  await postService.deletePost(postId.id);

  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
};
