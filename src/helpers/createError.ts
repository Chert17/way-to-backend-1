import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  controller: (req: Request, res: Response) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    controller(req, res).catch(next);
  };
};
