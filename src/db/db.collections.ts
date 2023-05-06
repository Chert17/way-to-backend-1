import { db } from './db';

import {
  IBlogDb,
  ICommentsDb,
  IEmailConfirmByUserDb,
  IPostDb,
  IUserDb,
} from './db.types';

export const blogsDbCollection = db.collection<IBlogDb>('blogs');

export const postsDbCollection = db.collection<IPostDb>('posts');

export const usersDbCollection = db.collection<IUserDb>('users');

export const emailConfirmationByUserDbCollection =
  db.collection<IEmailConfirmByUserDb>('emailConfirmationByUser');

export const commentsDbCollection = db.collection<ICommentsDb>('comments');
