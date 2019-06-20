import { Request, Response } from 'express';

type RequestWithSession = Request & { session?: any };

export interface SessionOptions {
  lookupSession?: string;
}

export default {
  name: 'session',

  lookup(req: RequestWithSession, res: Response, options: SessionOptions) {
    let found;

    if (options.lookupSession !== undefined && typeof req && req.session) {
      found = req.session[options.lookupSession];
    }

    return found;
  },

  cacheUserLanguage(
    req: RequestWithSession,
    res: Response,
    lng: string,
    options: SessionOptions = {}
  ) {
    if (options.lookupSession && req && req.session) {
      req.session[options.lookupSession] = lng;
    }
  },
};
