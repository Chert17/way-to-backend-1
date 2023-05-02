import { Request } from 'express';

export type TypeRequestBody<T> = Request<{}, {}, T>;
export type TypeRequestParamsAndBody<T, B> = Request<T, {}, B>;
export type TypeRequestParams<T> = Request<T>;
export type TypeRequestQuery<T> = Request<{}, {}, {}, T>;
export type TypeRequestParamsAndQuery<T, B> = Request<T, {}, {}, B>;

export type TypeQueryParams = {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
};

export type TypeValidQueryParams = {
  condition: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  page: number;
  pageSize: number;
};
