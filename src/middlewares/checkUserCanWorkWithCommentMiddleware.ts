import { Response, NextFunction } from 'express';
import { commentQueryRepo } from '../repositories/comments/comment.query.repo';
import { TypeRequestParams } from '../types/req-res.types';
import { STATUS_CODE } from '../utils/status.code';

export const checkUserCanWorkWithCommentMiddleware = async (
  req: TypeRequestParams<{ commentId: string }>,
  res: Response,
  next: NextFunction
) => {
  console.log('ID', req.params.commentId);

  const comment = await commentQueryRepo.getCommentById(req.params.commentId);

  console.log('COMMENT :', comment);

  if (!comment) {
    res.sendStatus(STATUS_CODE.NOT_FOUND);
    return;
  }

  if (req.userId !== comment.commentatorInfo.userId) {
    res.sendStatus(STATUS_CODE.FORBIDDEN);
    return;
  }

  next();
};
