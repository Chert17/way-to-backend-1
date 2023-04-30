import { Request, Response } from 'express';

import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from '../service/blogs.service';
import { STATUS_CODE } from '../utils/status.code';
import { BlogInputModel, BlogViewModel } from '../models/blogs.models';
import {
  TypeRequestBody,
  TypeRequestParams,
  TypeRequestParamsAndBody,
} from '../types/req-res.types';
import { IBlogDb } from '../db/db.types';

export const getAllBlogsController = async (
  req: Request,
  res: Response<BlogViewModel[]>
) => {
  const blogs = await getAllBlogs();
  return res.status(STATUS_CODE.OK).json(blogs);
};

export const getBlogByIdController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response<BlogViewModel>
) => {
  const blog = await getBlogById(req.params.id);

  if (!blog) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  return res.status(STATUS_CODE.OK).json(blog);
};

export const postBlogController = async (
  req: TypeRequestBody<BlogInputModel>,
  res: Response<BlogViewModel>
) => {
  const { name, description, websiteUrl } = req.body;

  const newBlog: IBlogDb = {
    name,
    description,
    websiteUrl,
    createdAt: new Date().toISOString(),
    isMembership: false,
  };

  const blog = await createBlog(newBlog);

  if (!blog) return res.status(STATUS_CODE.BAD_REQUEST);

  return res.status(STATUS_CODE.CREATED).json(blog);
};

export const updateBlogController = async (
  req: TypeRequestParamsAndBody<{ id: string }, BlogInputModel>,
  res: Response
) => {
  const blog = await updateBlog(req.params.id, req.body);

  if (!blog) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
};

export const deleteBlogController = async (
  req: TypeRequestParams<{ id: string }>,
  res: Response
) => {
  const blog = await deleteBlog(req.params.id);

  if (!blog) return res.sendStatus(STATUS_CODE.NOT_FOUND);

  return res.sendStatus(STATUS_CODE.NOT_CONTENT);
};
