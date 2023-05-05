import { Router } from 'express';

import {
  deleteCommentController,
  getCommentByIdController,
  updateCommentController,
} from '../controllers/comments.controller';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware';
import { commentRequestBodySchema } from '../validation/comments/comment.request.body.schema';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';
import { checkUserCanWorkWithCommentMiddleware } from '../middlewares/checkUserCanWorkWithCommentMiddleware';

export const commentRouter = Router();

commentRouter.get('/:id', getCommentByIdController);

commentRouter.put(
  '/:commentId',
  jwtAuthMiddleware,
  checkUserCanWorkWithCommentMiddleware,
  commentRequestBodySchema,
  validateRequestMiddleware,
  updateCommentController
);

commentRouter.delete(
  '/:commentId',
  jwtAuthMiddleware,
  checkUserCanWorkWithCommentMiddleware,
  deleteCommentController
);
