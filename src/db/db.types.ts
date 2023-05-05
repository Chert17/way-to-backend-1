import { CommentatorInfo } from '../models/comments.models';

export interface IBlogDb {
  // _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export interface IPostDb {
  // _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

export interface IUserDb {
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
}

export interface ICommentsDb {
  content: string;
  postId: string;
  postTitle: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
}
