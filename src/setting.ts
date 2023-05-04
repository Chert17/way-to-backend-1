import express, { Request, Response } from 'express';
import { videoRouter } from './routes/video.routes';

import { STATUS_CODE } from './utils/status.code';

import { rootRouter } from './routes/index.routes';

export const app = express();

app.use(express.json());

app.use('/videos', videoRouter);

app.use('/', rootRouter);

app.use((req: Request, res: Response) => {
  return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Not found' });
});
