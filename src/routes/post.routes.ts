import express from 'express';

import {
  createCommentByPostIdController,
  createPostController,
  deletePostController,
  getAllCommentsByOnePostController,
  getAllPostsController,
  getPostByIdController,
  updatePostController,
} from '../controllers/posts.controller';

import { authMiddleware } from '../middlewares/authMiddleware';
import { postRequestBodySchema } from '../validation/posts/posts.request.body.schema';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware';
import { commentRequestBodySchema } from '../validation/comments/comment.request.body.schema';

export const postRouter = express.Router();

postRouter.get('/', getAllPostsController);
postRouter.get('/:id', getPostByIdController);

postRouter.get('/:postId/comments', getAllCommentsByOnePostController);

postRouter.post(
  '/',
  authMiddleware,
  postRequestBodySchema,
  validateRequestMiddleware,
  createPostController
);

postRouter.post(
  '/:postId/comments',
  jwtAuthMiddleware,
  commentRequestBodySchema,
  validateRequestMiddleware,
  createCommentByPostIdController
);

postRouter.put(
  '/:id',
  authMiddleware,
  postRequestBodySchema,
  validateRequestMiddleware,
  updatePostController
);

postRouter.delete('/:id', authMiddleware, deletePostController);
