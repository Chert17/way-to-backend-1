import express from 'express';

import { blogRouter } from './blog.routes';
import { postRouter } from './post.routes';
import { userRouter } from './user.routes';
import { testingRouter } from './testing.all-data.routes';
import { authgRouter } from './auth.login.routes';

export const rootRouter = express.Router();

rootRouter.use('/testing/all-data', testingRouter);
rootRouter.use('/auth/login', authgRouter);
rootRouter.use('/blogs', blogRouter);
rootRouter.use('/posts', postRouter);
rootRouter.use('/users', userRouter);