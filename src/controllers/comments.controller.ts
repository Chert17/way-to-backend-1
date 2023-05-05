import { Response } from 'express';

import { TypeRequestParams } from '../types/req-res.types';
import { commentQueryRepo } from '../repositories/comments/comment.query.repo';
import { STATUS_CODE } from '../utils/status.code';
import { CommentViewModel } from '../models/comments.models';

export const getCommentByIdController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response<CommentViewModel>
) => {
  const comment = await commentQueryRepo.getCommentById(req.params.id);

  if (!comment) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  return res.status(STATUS_CODE.OK).json(comment);
};
