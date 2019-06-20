import { Request, Response } from 'express';

export interface PathOptions {
  lookupPath?: string;
  lookupFromPathIndex?: number;
}

export default {
  name: 'path',

  lookup(req: Request, res: Response, options: PathOptions) {
    let found;

    if (req === undefined) {
      return found;
    }

    if (options.lookupPath !== undefined && req.params) {
      found = req.params[options.lookupPath];
    }

    if (!found && typeof options.lookupFromPathIndex === 'number' && req.originalUrl) {
      let path = req.originalUrl.split('?')[0];
      let parts = path.split('/');
      if (parts[0] === '') {
        // Handle paths that start with a slash, i.e., '/foo' -> ['', 'foo']
        parts.shift();
      }

      if (parts.length > options.lookupFromPathIndex) {
        found = parts[options.lookupFromPathIndex];
      }
    }

    return found;
  },
};
