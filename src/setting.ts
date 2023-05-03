import express, { Request, Response } from 'express';
import { videoRouter } from './routes/video.routes';

import { STATUS_CODE } from './utils/status.code';

import { videosData } from './utils/videos.data';
import { blogsDbCollection, postsDbCollection } from './db/db.collections';

import { blogRouter } from './routes/blog.routes';
import { postRouter } from './routes/post.routes';
import { userRouter } from './routes/user.routes';

export const app = express();

app.use(express.json());

app.delete('/testing/all-data', (req: Request, res: Response) => {
  videosData.splice(0);
  blogsDbCollection.deleteMany();
  postsDbCollection.deleteMany();
  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
});

app.use('/videos', videoRouter);
app.use('/blogs', blogRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);

app.use((req: Request, res: Response) => {
  return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Not found' });
});
