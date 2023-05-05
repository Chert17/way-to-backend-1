import { Router } from 'express';

import { getCommentByIdController } from '../controllers/comments.controller';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware';
import { commentRequestBodySchema } from '../validation/comments/comment.request.body.schema';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';

export const commentRouter = Router();

commentRouter.get('/:id', getCommentByIdController);

commentRouter.put(
  '/:icommentId',
  jwtAuthMiddleware,
  commentRequestBodySchema,
  validateRequestMiddleware
);

commentRouter.delete(
  '/:icommentId',
  jwtAuthMiddleware,
  commentRequestBodySchema,
  validateRequestMiddleware
);
