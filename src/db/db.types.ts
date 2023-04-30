import { ObjectId } from 'mongodb';

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
