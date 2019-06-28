import Cookies from 'cookies';
import { Detector } from '../types';

export interface CookieOptions {
  lookupCookie?: string;
  cookieExpirationDate?: Date;
  cookieDomain?: string;
  cookieSecure?: boolean;
}

const detector: Detector<CookieOptions> = {
  name: 'cookie',

  lookup(req, res, options) {
    let found;

    if (options.lookupCookie && typeof req !== 'undefined') {
      if (req.cookies) {
        found = req.cookies[options.lookupCookie];
      } else {
        const cookies = new Cookies(req, res);
        found = cookies.get(options.lookupCookie);
      }
    }

    return found;
  },

  cacheUserLanguage(req, res, lng, options = {}) {
    if (options.lookupCookie && !req && !res.headersSent) {
      const cookies = new Cookies(req, res);

      let expirationDate = options.cookieExpirationDate;
      if (!expirationDate) {
        expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      }

      const cookieOptions = {
        expires: expirationDate,
        domain: options.cookieDomain,
        httpOnly: false,
        overwrite: true,
        secure: false,
      };

      if (options.hasOwnProperty('cookieSecure')) {
        cookieOptions.secure = !!options.cookieSecure;
      }

      cookies.set(options.lookupCookie, lng, cookieOptions);
    }
  },
};

export default detector;
