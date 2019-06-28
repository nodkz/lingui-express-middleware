import { Request, Response } from 'express';

export interface Detector<OPTS = any> {
  name: string;
  lookup: (req: Request, res: Response, options: OPTS) => string | string[] | void;
  cacheUserLanguage?: (req: Request, res: Response, lng: string, options: OPTS) => void;
}
