import { Response } from 'express';

import {
  TypeRequestParams,
  TypeRequestParamsAndBody,
} from '../types/req-res.types';
import { commentQueryRepo } from '../repositories/comments/comment.query.repo';
import { STATUS_CODE } from '../utils/status.code';
import { CommentInputModel, CommentViewModel } from '../models/comments.models';
import { commentService } from '../service/comments.service';

export const getCommentByIdController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response<CommentViewModel>
) => {
  const comment = await commentQueryRepo.getCommentById(req.params.id);

  if (!comment) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  return res.status(STATUS_CODE.OK).json(comment);
};

export const updateCommentController = async (
  req: TypeRequestParamsAndBody<{ commentId: string }, CommentInputModel>,
  res: Response
) => {
  const { commentId } = req.params;
  const { content } = req.body;

  await commentService.updateComment(commentId, content);

  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
};

export const deleteCommentController = async (
  req: TypeRequestParams<{ commentId: string }>,
  res: Response
) => {
  await commentService.deleteComment(req.params.commentId);

  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
};
