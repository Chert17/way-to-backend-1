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

export const getAllBlogsController = async (
  req: Request,
  res: Response<IWithPagination<BlogViewModel>[]>
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

export const postBlogController = async (
  req: TypeRequestBody<BlogInputModel>,
  res: Response<BlogViewModel>
) => {
  const { name, description, websiteUrl } = req.body;

  const blog = await blogService.createBlog({ name, description, websiteUrl });

  if (!blog) return res.status(STATUS_CODE.BAD_REQUEST);

  return res.status(STATUS_CODE.CREATED).json(blog);
};

//TODO
// export const postPostByBlogIdController = async (
//   req: TypeRequestParamsAndBody<{ blogId: string }, BlogPostInputModel>,
//   res: Response<PostViewModel>
// ) => {
//   const { blogId } = req.params;
//   const { content, shortDescription, title } = req.body;

//   const blog = await blogQueryRepo.getBlogById(blogId);

//   if (!blog) return res.sendStatus(STATUS_CODE.NOT_FOUND);

//   const newPost: IPostDb = {
//     title,
//     shortDescription,
//     content,
//     blogId: blog.id,
//     blogName: blog.name,
//     createdAt: new Date().toISOString(),
//   };

//   const post = await createPost(newPost);

//   if (!post) return res.sendStatus(STATUS_CODE.BAD_REQUEST);

//   return res.status(STATUS_CODE.CREATED).json(post);
// };

export const updateBlogController = async (
  req: TypeRequestParamsAndBody<{ id: string }, BlogInputModel>,
  res: Response
) => {
  const blog = await blogService.updateBlog(req.params.id, req.body);

  if (!blog) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
};

export const deleteBlogController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response
) => {
  const blog = await blogService.deleteBlog(req.params.id);

  if (!blog) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
};
