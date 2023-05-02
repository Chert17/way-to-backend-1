import { ObjectId } from 'mongodb';
import { postsDbCollection } from '../../db/db.collections';
import { PostViewModel } from '../../models/posts.models';
import { IWithPagination } from '../../types/pagination.interface';

export const postQueryRepo = {
  getAllPosts: async (): Promise<IWithPagination<PostViewModel>> => {
    const posts = await postsDbCollection.find().toArray();

    return {
      pagesCount: 0,
      pageSize: 0,
      page: 0,
      totalCount: 0,
      items: posts.map(post => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
      })),
    };
  },

  getPostById: async (id: string): Promise<PostViewModel | null> => {
    const post = await postsDbCollection.findOne({ _id: new ObjectId(id) });

    if (!post) return null;

    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  },
};
