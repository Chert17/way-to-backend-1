import { db } from './db';
import { IBlogDb, IPostDb } from './db.types';

export const blogsDbCollection = db.collection<IBlogDb>('blogs');
export const postsDbCollection = db.collection<IPostDb>('posts');
