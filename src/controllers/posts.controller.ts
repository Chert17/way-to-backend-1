import { Response } from 'express';

import { postService } from '../service/posts.service';
import { PostInputModel, PostViewModel } from '../models/posts.models';
import { STATUS_CODE } from '../utils/status.code';
import {
  PaginationQueryParams,
  TypeRequestBody,
  TypeRequestParams,
  TypeRequestParamsAndBody,
  TypeRequestParamsAndQuery,
  TypeRequestQuery,
} from '../types/req-res.types';

import { postQueryRepo } from '../repositories/posts/post.query.repo';
import { IWithPagination } from '../types/pagination.interface';
import { paginationQueryParamsValidation } from '../helpers/request.query.params.validation';
import { CommentInputModel, CommentViewModel } from '../models/comments.models';
import { commentQueryRepo } from '../repositories/comments/comment.query.repo';
import { commentService } from '../service/comments.service';

export const getAllPostsController = async (
  req: TypeRequestQuery<PaginationQueryParams>,
  res: Response<IWithPagination<PostViewModel>>
) => {
  const queryParams = paginationQueryParamsValidation(req.query);

  const posts = await postQueryRepo.getAllPosts(queryParams);

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

export const getAllCommentsByOnePostController = async (
  req: TypeRequestParamsAndQuery<{ postId: string }, PaginationQueryParams>,
  res: Response<IWithPagination<CommentViewModel>>
) => {
  const { postId } = req.params;

  const post = await postQueryRepo.getPostById(postId);

  if (!post) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  const queryParams = paginationQueryParamsValidation(req.query);

  const comments = await commentQueryRepo.getAllComments(post.id, queryParams);

  return res.status(STATUS_CODE.OK).json(comments);
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

export const createCommentByPostIdController = async (
  req: TypeRequestParamsAndBody<{ postId: string }, CommentInputModel>,
  res: Response<CommentViewModel>
) => {
  const { content } = req.body;

  const post = await postQueryRepo.getPostById(req.params.postId);

  if (!post) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  const commentId = await commentService.createComment(
    content,
    post.id,
    post.title,
    req.userId!
  );

  if (!commentId) return res.sendStatus(STATUS_CODE.BAD_REQUEST);

  const comment = await commentQueryRepo.getCommentById(commentId.toString());

  if (!comment) return res.sendStatus(STATUS_CODE.BAD_REQUEST);

  return res.status(STATUS_CODE.CREATED).json(comment);
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
