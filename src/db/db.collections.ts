import { db } from './db';

import { IBlogDb, IPostDb, IUserDb } from './db.types';

export const blogsDbCollection = db.collection<IBlogDb>('blogs');
export const postsDbCollection = db.collection<IPostDb>('posts');
export const usersDbCollection = db.collection<IUserDb>('users');
