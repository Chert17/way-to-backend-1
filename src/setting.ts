import express, { Request, Response } from 'express';
import { videoRouter } from './routes/video.routes';
import { STATUS_CODE } from './utils/status.code';
import { videosData } from './utils/videos.data';
import { blogsData } from './utils/blogs.data';
import { postsData } from './utils/posts.data';
import { blogRouter } from './routes/blog.routes';

export const app = express();

app.use(express.json());

app.delete('/testing/all-data', (req: Request, res: Response) => {
  videosData.splice(0);
  blogsData.splice(0);
  postsData.splice(0);
  res.sendStatus(STATUS_CODE.NOT_CONTENT);
});

app.use('/videos', videoRouter);
app.use('/blogs', blogRouter);
// app.use('/posts');

app.use((req: Request, res: Response) => {
  res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Not found' });
});
