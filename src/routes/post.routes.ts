import express from 'express';

import {
  deletePostController,
  getAllPostsController,
  getPostByIdController,
  postPostController,
  updatePostController,
} from '../controllers/posts.controller';

import { authMiddleware } from '../middlewares/authMiddleware';
import { postRequestBodySchema } from '../validation/posts.request.body.schema';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';

export const postRouter = express.Router();

postRouter.get('/', getAllPostsController);
postRouter.get('/:id', getPostByIdController);

postRouter.post(
  '/',
  authMiddleware,
  postRequestBodySchema,
  validateRequestMiddleware,
  postPostController
);

postRouter.put(
  '/:id',
  authMiddleware,
  postRequestBodySchema,
  validateRequestMiddleware,
  updatePostController
);

postRouter.delete('/:id', authMiddleware, deletePostController);
