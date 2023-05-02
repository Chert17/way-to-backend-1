import express from 'express';

import {
  createBlogController,
  createPostByBlogIdController,
  deleteBlogController,
  getAllBlogsController,
  getAllPostsByOneBlogController,
  getBlogByIdController,
  updateBlogController,
} from '../controllers/blogs.controller';

import { authMiddleware } from '../middlewares/authMiddleware';
import { blogRequestBodySchema } from '../validation/blogs/blog.request.body.schema';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { postRequestBodySchema } from '../validation/posts/posts.request.body.schema';

export const blogRouter = express.Router();

blogRouter.get('/', getAllBlogsController);
blogRouter.get('/:id', getBlogByIdController);

blogRouter.get('/:blogId/posts', getAllPostsByOneBlogController);

blogRouter.post(
  '/',
  authMiddleware,
  blogRequestBodySchema,
  validateRequestMiddleware,
  createBlogController
);

blogRouter.post(
  '/:blogId/posts',
  authMiddleware,
  postRequestBodySchema,
  createPostByBlogIdController
);

blogRouter.put(
  '/:id',
  authMiddleware,
  blogRequestBodySchema,
  validateRequestMiddleware,
  updateBlogController
);

blogRouter.delete('/:id', authMiddleware, deleteBlogController);
