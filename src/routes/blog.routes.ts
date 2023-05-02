import express from 'express';

import {
  deleteBlogController,
  getAllBlogsController,
  getBlogByIdController,
  postBlogController,
  updateBlogController,
} from '../controllers/blogs.controller';

import { authMiddleware } from '../middlewares/authMiddleware';
import { blogRequestBodySchema } from '../validation/blog.request.body.schema';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';

export const blogRouter = express.Router();

blogRouter.get('/', getAllBlogsController);
blogRouter.get('/:id', getBlogByIdController);

blogRouter.get('/:blogId/posts');

blogRouter.post(
  '/',
  authMiddleware,
  blogRequestBodySchema,
  validateRequestMiddleware,
  postBlogController
);

//TODO
// blogRouter.post(
//   '/:blogId/posts',
//   authMiddleware,
//   postRequestBodySchema,
//   postPostByBlogIdController
// );

blogRouter.put(
  '/:id',
  authMiddleware,
  blogRequestBodySchema,
  validateRequestMiddleware,
  updateBlogController
);

blogRouter.delete('/:id', authMiddleware, deleteBlogController);
