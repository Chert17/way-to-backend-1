import express, { Request, Response } from 'express';

import { videoRouter } from './routes/video.routes';
import { STATUS_CODE } from './utils/status.code';
import { videosData } from './utils/videos.data';

export const app = express();
const port = 3000;

app.use(express.json());

app.delete('/testing/all-data', (req: Request, res: Response) => {
  videosData.splice(0);
  res.sendStatus(STATUS_CODE.NOT_CONTENT);
});

app.use('/videos', videoRouter);

app.use((req: Request, res: Response) => {
  res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Not found' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
