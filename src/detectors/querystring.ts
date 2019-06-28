import url from 'url';
import { Detector } from '../types';

export interface QuerystringOptions {
  lookupQuerystring?: string;
}

const detector: Detector<QuerystringOptions> = {
  name: 'querystring',

  lookup(req, res, options) {
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

export default detector;
