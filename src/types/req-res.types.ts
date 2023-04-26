import { Request } from 'express';

export type TypeRequestBody<T> = Request<{}, {}, T>;
export type TypeRequestParamsAndBody<T, B> = Request<T, {}, B>;
export type TypeRequestParams<T> = Request<T>;
