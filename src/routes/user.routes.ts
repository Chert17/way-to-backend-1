import express from 'express';

import {
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
} from '../controllers/users.controller';

export const userRouter = express.Router();

userRouter.get('/', getAllUsersController);

userRouter.get('/:id', getUserByIdController);

userRouter.delete('/:id', deleteUserController);
