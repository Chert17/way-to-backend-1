import express from 'express';

import {
  createPostController,
  deletePostController,
  getAllPostsController,
  getPostByIdController,
  updatePostController,
} from '../controllers/posts.controller';

import { authMiddleware } from '../middlewares/authMiddleware';
import { postRequestBodySchema } from '../validation/posts/posts.request.body.schema';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';

export const postRouter = express.Router();

postRouter.get('/', getAllPostsController);
postRouter.get('/:id', getPostByIdController);

postRouter.post(
  '/',
  authMiddleware,
  postRequestBodySchema,
  validateRequestMiddleware,
  createPostController
);

postRouter.put(
  '/:id',
  authMiddleware,
  postRequestBodySchema,
  validateRequestMiddleware,
  updatePostController
);

postRouter.delete('/:id', authMiddleware, deletePostController);
