import { IErrorsMessages } from '../controllers/videos.controllers';
import { minAgeRestrictionValidation } from '../helpers/minAgeRestriction.validation';
import { resolutionValidation } from '../helpers/resolution.validation';
import { titleAndAuthorValidation } from '../helpers/title-author.validation';
import { UpdateVideoInputModel } from '../models/videos.models';

export const updateVideoValidation = (
  errorsMessages: IErrorsMessages[],
  params: UpdateVideoInputModel
) => {
  const {
    author,
    availableResolutions,
    canBeDownloaded,
    minAgeRestriction,
    publicationDate,
    title,
  } = params;

  const titleError = titleAndAuthorValidation(title, 40);
  const autorError = titleAndAuthorValidation(author, 20);
  const resolutionError = resolutionValidation(availableResolutions);
  const minAgeRegisterError = minAgeRestrictionValidation(
    minAgeRestriction,
    1,
    18
  );

  if (titleError) errorsMessages.push({ message: titleError, field: 'title' });
  if (autorError) errorsMessages.push({ message: autorError, field: 'author' });
  if (resolutionError)
    errorsMessages.push({
      message: resolutionError,
      field: 'availableResolutions',
    });
  if (canBeDownloaded && typeof canBeDownloaded !== 'boolean')
    errorsMessages.push({
      message: 'Field must be boolean',
      field: 'canBeDownloaded',
    });
  if (minAgeRegisterError)
    errorsMessages.push({
      message: minAgeRegisterError,
      field: 'minAgeRestriction',
    });
  if (!publicationDate || typeof publicationDate !== 'string')
    errorsMessages.push({
      message: 'Field must be a string',
      field: 'publicationDate',
    });

  return;
};
