import { Request, Response } from 'express';

import { blogService } from '../service/blogs.service';
import { STATUS_CODE } from '../utils/status.code';
import { BlogInputModel, BlogViewModel } from '../models/blogs.models';
import {
  TypeRequestBody,
  TypeRequestParams,
  TypeRequestParamsAndBody,
} from '../types/req-res.types';

import { blogQueryRepo } from '../repositories/blogs/blog.query.repo';
import { IWithPagination } from '../types/pagination.interface';
import { PostInputModel, PostViewModel } from '../models/posts.models';
import { postService } from '../service/posts.service';
import { postQueryRepo } from '../repositories/posts/post.query.repo';

export const getAllBlogsController = async (
  req: Request,
  res: Response<IWithPagination<BlogViewModel>>
) => {
  const blogs = await blogQueryRepo.getAllBlogs();
  return res.status(STATUS_CODE.OK).json(blogs);
};

export const getBlogByIdController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response<BlogViewModel>
) => {
  const blog = await blogQueryRepo.getBlogById(req.params.id);

  if (!blog) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  return res.status(STATUS_CODE.OK).json(blog);
};

export const getAllPostsByOneBlogController = async (
  req: TypeRequestParams<{ blogId: string }>,
  res: Response<IWithPagination<PostViewModel>>
) => {
  const blogId = await blogQueryRepo.getBlogById(req.params.blogId);

  if (!blogId) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  const posts = await postQueryRepo.getAllPosts();

  return res.status(STATUS_CODE.OK).json(posts);
};

export const createBlogController = async (
  req: TypeRequestBody<BlogInputModel>,
  res: Response<BlogViewModel>
) => {
  const { name, description, websiteUrl } = req.body;

  const blogId = await blogService.createBlog({
    name,
    description,
    websiteUrl,
  });

  if (!blogId) return res.sendStatus(STATUS_CODE.BAD_REQUEST);

  const blog = await blogQueryRepo.getBlogById(blogId.toString());

  if (!blog) return res.status(STATUS_CODE.BAD_REQUEST);

  return res.status(STATUS_CODE.CREATED).json(blog);
};

export const createPostByBlogIdController = async (
  req: TypeRequestParamsAndBody<
    { blogId: string },
    Omit<PostInputModel, 'blogId'>
  >,
  res: Response<PostViewModel>
) => {
  const { blogId } = req.params;
  const { content, shortDescription, title } = req.body;

  const postId = await postService.createPost({
    blogId,
    content,
    shortDescription,
    title,
  });

  if (!postId) return res.sendStatus(STATUS_CODE.BAD_REQUEST);

  const post = await postQueryRepo.getPostById(postId.toString());

  if (!post) return res.status(STATUS_CODE.BAD_REQUEST);

  return res.status(STATUS_CODE.CREATED).json(post);
};

export const updateBlogController = async (
  req: TypeRequestParamsAndBody<{ id: string }, BlogInputModel>,
  res: Response
) => {
  const blogId = await blogQueryRepo.getBlogById(req.params.id);

  if (!blogId) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  await blogService.updateBlog(req.params.id, req.body);

  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
};

export const deleteBlogController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response
) => {
  const blogId = await blogQueryRepo.getBlogById(req.params.id);

  if (!blogId) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  await blogService.deleteBlog(req.params.id);

  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
};
