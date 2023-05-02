import { Request } from 'express';

export type TypeRequestBody<T> = Request<{}, {}, T>;
export type TypeRequestParamsAndBody<T, B> = Request<T, {}, B>;
export type TypeRequestParams<T> = Request<T>;
export type TypeRequestQuery<T> = Request<{}, {}, {}, T>;
export type TypeRequestParamsAndQuery<T, B> = Request<T, {}, {}, B>;

export type TypeRequestParamsPagination = {
  searchNameTerm?: string;
  sortDirection?: 'asc' | 'desc';
  sortBy?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type TypeValidRequestQueryParams = {
  searchNameTerm: string;
  sortDirection: 'asc' | 'desc';
  sortBy: string;
  pageNumber: number;
  pageSize: number;
};
