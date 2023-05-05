import { ObjectId } from 'mongodb';

import { commentsDbCollection } from '../../db/db.collections';
import { CommentViewModel } from '../../models/comments.models';
import { converterCommentTovalidForm } from '../../helpers/converterToValidFormatData/converter.comment';
import { ValidPaginationQueryParams } from '../../types/req-res.types';
import { IWithPagination } from '../../types/pagination.interface';

export const commentQueryRepo = {
  getAllComments: async (
    postId: string,
    pagination: ValidPaginationQueryParams
  ): Promise<IWithPagination<CommentViewModel>> => {
    const { page, pageSize, sortBy, sortDirection } = pagination;

    const find = { postId: postId };

    const comments = await commentsDbCollection
      .find(find)
      .sort(sortBy, sortDirection)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await commentsDbCollection.countDocuments(find);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize,
      page,
      totalCount,
      items: comments.map(converterCommentTovalidForm),
    };
  },

  getCommentById: async (id: string): Promise<CommentViewModel | null> => {
    const comment = await commentsDbCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!comment) return null;

    return converterCommentTovalidForm(comment);
  },
};
