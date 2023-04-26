import express from 'express';

import {
  deleteVideoController,
  getAllVideosController,
  getVideoByIdController,
  postVideoController,
  updateVideoController,
} from '../controllers/videos.controllers';

export const videoRouter = express.Router();

videoRouter.get('/', getAllVideosController);
videoRouter.get('/:id', getVideoByIdController);
videoRouter.post('/', postVideoController);
videoRouter.put('/:id', updateVideoController);
videoRouter.delete('/:id', deleteVideoController);
