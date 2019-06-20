import Cookies from 'cookies';
import { Request, Response } from 'express';

export interface CookieOptions {
  lookupCookie?: string;
  cookieExpirationDate?: Date;
  cookieDomain?: string;
  cookieSecure?: boolean;
}

export default {
  name: 'cookie',

  lookup(req: Request, res: Response, options: CookieOptions) {
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

  cacheUserLanguage(req: Request, res: Response, lng: string, options: CookieOptions = {}) {
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
