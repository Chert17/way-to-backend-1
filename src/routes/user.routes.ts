import express from 'express';

import {
  createUserController,
  deleteUserController,
  getAllUsersController,
} from '../controllers/users.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { userRequestBodySchema } from '../validation/users/user.request.body.schema';
import { validateRequestMiddleware } from '../middlewares/validateRequestMiddleware';

export const userRouter = express.Router();

userRouter.get('/', getAllUsersController);

userRouter.post(
  '/',
  authMiddleware,
  userRequestBodySchema,
  validateRequestMiddleware,
  createUserController
);

userRouter.delete('/:id', authMiddleware, deleteUserController);
