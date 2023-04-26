import { Request, Response } from 'express';

import {
  createVideo,
  deleteVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
} from '../service/videos.service';
import {
  TypeRequestBody,
  TypeRequestParams,
  TypeRequestParamsAndBody,
} from '../types/req-res.types';
import {
  CreateVideoInputModel,
  VideoViewOutputModel,
  UpdateVideoInputModel,
} from '../models/videos.models';
import { IVideo } from '../types/video.interface';
import { STATUS_CODE } from '../utils/status.code';
import { postVideoValidation } from '../validation/postVideo.validation';
import { updateVideoValidation } from '../validation/updateVideo.validation';

export interface IErrorsMessages {
  message: string;
  field: string;
}

const errorsMessages: IErrorsMessages[] = [];

export const getAllVideosController = async (
  req: Request,
  res: Response<VideoViewOutputModel[]>
) => {
  const videos = await getAllVideos();
  res.status(STATUS_CODE.OK).json(videos);
};

export const getVideoByIdController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response<VideoViewOutputModel>
) => {
  const video = await getVideoById(+req.params.id);
  if (!video) {
    res.sendStatus(STATUS_CODE.NOT_FOUND);
    return;
  }

  res.status(STATUS_CODE.OK).json(video);
};

export const postVideoController = async (
  req: TypeRequestBody<CreateVideoInputModel>,
  res: Response<VideoViewOutputModel | IErrorsMessages[]>
) => {
  const { author, availableResolutions, title } = req.body;

  errorsMessages.splice(0);

  postVideoValidation(errorsMessages, req.body);

  if (errorsMessages.length > 0) {
    res.status(STATUS_CODE.BAD_REQUEST).json(errorsMessages);
    return;
  }

  const date = new Date();
  const dateAddOneDay = new Date(
    date.setDate(date.getDate() + 1)
  ).toISOString();

  const newVideo: IVideo = {
    id: Date.now(),
    author,
    title,
    availableResolutions,
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: date.toISOString(),
    publicationDate: dateAddOneDay,
  };

  const video = await createVideo(newVideo);

  res.status(STATUS_CODE.CREATED).json(video);

  errorsMessages.splice(0);
};

export const updateVideoController = async (
  req: TypeRequestParamsAndBody<{ id: string }, UpdateVideoInputModel>,
  res: Response
) => {
  errorsMessages.splice(0);

  updateVideoValidation(errorsMessages, req.body);

  if (errorsMessages.length > 0) {
    res.status(STATUS_CODE.BAD_REQUEST).json(errorsMessages);
    return;
  }

  const video = await updateVideo(+req.params.id, req.body);

  if (!video) {
    res.sendStatus(STATUS_CODE.NOT_FOUND);
    return;
  }

  res.sendStatus(STATUS_CODE.NOT_CONTENT);
};

export const deleteVideoController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response<VideoViewOutputModel>
) => {
  const video = await deleteVideo(+req.params.id);

  if (!video) {
    res.sendStatus(STATUS_CODE.NOT_FOUND);
    return;
  }

  res.sendStatus(STATUS_CODE.NOT_CONTENT);
};
