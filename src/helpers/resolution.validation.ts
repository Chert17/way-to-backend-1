import { AvailableResolutions } from '../types/video.interface';

const errorMessage =
  'At least one resolution should be added P144, P240, P360, P480, P720, P1080, P1440, P2160';

export const resolutionValidation = (resolution: string[]) => {
  if (!resolution || !resolution.length) return errorMessage;

  const values = Object.values(AvailableResolutions) as string[];

  const result = resolution.every(elem => values.includes(elem));

  return result ? null : errorMessage;
};
