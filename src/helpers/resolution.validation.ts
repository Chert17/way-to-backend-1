import { AvailableResolutions } from '../types/video.interface';

const errorMessage =
  'At least one resolution should be added P144, P240, P360, P480, P720, P1080, P1440, P2160';

export const resolutionValidation = (resolution: string[]) => {
  if (!resolution || !resolution.length) return errorMessage;

  const value = Object.values(AvailableResolutions) as string[];

  let result = true;

  for (const element of value) {
    if (!resolution.includes(element)) {
      result = false;
      return;
    }
  }

  return !result ? errorMessage : null;
};
