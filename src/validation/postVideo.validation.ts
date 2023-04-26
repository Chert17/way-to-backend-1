import { resolutionValidation } from '../helpers/resolution.validation';
import { titleAndAuthorValidation } from '../helpers/title-author.validation';
import { IErrorsMessages } from '../controllers/videos.controllers';
import { CreateVideoInputModel } from '../models/videos.models';

export const postVideoValidation = (
  errorsMessages: IErrorsMessages[],
  params: CreateVideoInputModel
) => {
  const { author, availableResolutions, title } = params;

  const titleError = titleAndAuthorValidation(title, 40);
  const autorError = titleAndAuthorValidation(author, 20);
  const resolutionError = resolutionValidation(availableResolutions);

  if (titleError) errorsMessages.push({ message: titleError, field: 'title' });
  if (autorError) errorsMessages.push({ message: autorError, field: 'author' });
  if (resolutionError)
    errorsMessages.push({
      message: resolutionError,
      field: 'availableResolutions',
    });

  return;
};
