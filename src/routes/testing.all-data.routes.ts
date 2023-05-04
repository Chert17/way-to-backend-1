import { Request, Response, Router } from 'express';

import {
  blogsDbCollection,
  postsDbCollection,
  usersDbCollection,
} from '../db/db.collections';
import { STATUS_CODE } from '../utils/status.code';
import { videosData } from '../utils/videos.data';

export const testingRouter = Router();

testingRouter.delete('/', (req: Request, res: Response) => {
  videosData.splice(0);
  blogsDbCollection.deleteMany();
  postsDbCollection.deleteMany();
  usersDbCollection.deleteMany();
  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
});
