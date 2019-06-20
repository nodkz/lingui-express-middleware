import url from 'url';
import { Request, Response } from 'express';

export interface QueryStringOptions {
  lookupQuerystring?: string;
}

export default {
  name: 'querystring',

  lookup(req: Request, res: Response, options: QueryStringOptions) {
    let found;

    if (options.lookupQuerystring !== undefined && typeof req !== 'undefined') {
      if (req.query) {
        found = req.query[options.lookupQuerystring];
      } else {
        let querystring = url.parse(req.url, true);
        found = querystring.query[options.lookupQuerystring];
      }
    }

    return found;
  },
};
