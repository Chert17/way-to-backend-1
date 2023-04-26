import { UpdateVideoInputModel } from '../models/videos.models';
import { IVideo } from '../types/video.interface';
import { videosData } from '../utils/videos.data';

export const getAllVideos = async () => {
  return videosData;
};

export const getVideoById = async (videoId: number) => {
  const video = videosData.find(item => item.id === videoId);

  return video;
};

export const createVideo = async (video: IVideo) => {
  videosData.unshift(video);
  return video;
};

export const updateVideo = async (
  videoId: number,
  body: UpdateVideoInputModel
) => {
  const {
    author,
    availableResolutions,
    canBeDownloaded,
    minAgeRestriction,
    publicationDate,
    title,
  } = body;

  const video = videosData.find(item => item.id === videoId);
  if (!video) return false;

  video.author = author;
  video.title = title;
  video.canBeDownloaded = canBeDownloaded;
  video.minAgeRestriction = minAgeRestriction;
  video.publicationDate = publicationDate;
  video.availableResolutions = availableResolutions;

  return video;
};

export const deleteVideo = async (videoId: number) => {
  const idx = await videosData.findIndex(item => item.id === videoId);
  if (idx === -1) return false;

  await videosData.splice(idx, 1);

  return true;
};
