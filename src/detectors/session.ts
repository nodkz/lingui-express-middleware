import { Detector } from '../types';
import { Request } from 'express';

type RequestWithSession = Request & { session?: any };

export interface SessionOptions {
  lookupSession?: string;
}

const detector: Detector<SessionOptions> = {
  name: 'session',

  lookup(req: RequestWithSession, res, options) {
    let found;

    if (options.lookupSession !== undefined && typeof req && req.session) {
      found = req.session[options.lookupSession];
    }

    return found;
  },

  cacheUserLanguage(req: RequestWithSession, res, lng: string, options = {}) {
    if (options.lookupSession && req && req.session) {
      req.session[options.lookupSession] = lng;
    }
  },
};

export default detector;
