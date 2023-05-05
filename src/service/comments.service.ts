import { ObjectId } from 'mongodb';

import { ICommentsDb } from '../db/db.types';
import { commentRepo } from '../repositories/comments/comment.repo';
import { userQueryRepo } from '../repositories/users/user.query.repo';

export const commentService = {
  createComment: async (
    content: string,
    postId: string,
    postTitle: string,
    userId: string
  ): Promise<ObjectId | null> => {
    const user = await userQueryRepo.getUserById(userId);

    if (!user) return null;

    const newComment: ICommentsDb = {
      content,
      postId,
      postTitle,
      commentatorInfo: { userId: user.id, userLogin: user.login },
      createdAt: new Date().toISOString(),
    };

    return await commentRepo.createComment(newComment);
  },

  updateComment: async (
    commentId: string,
    content: string
  ): Promise<boolean> => {
    return await commentRepo.updateComment(commentId, content);
  },

  deleteComment: async (commentId: string): Promise<boolean> => {
    return await commentRepo.deleteComment(commentId);
  },
};
