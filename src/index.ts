/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/prefer-namespace-keyword */

import { setupI18n, I18n, Catalogs } from '@lingui/core';

import LanguageDetector from './LanguageDetector';
import { Request, Response, NextFunction } from 'express';

declare global {
  module Express {
    interface Request {
      lang: string | void;
      i18n: I18n;
      t: (id: string, values?: {}, opts?: { message?: string; formats?: {} }) => any;
    }
  }
}

export function lingui(catalogs: Catalogs) {
  const locales = Object.keys(catalogs);
  const langDetector = new LanguageDetector({
    availableLocales: locales,
    defaultLocale: locales[0],
  });

  return (req: Request, res: Response, next: NextFunction) => {
    const lang = langDetector.detect(req, res);
    req.lang = lang;
    req.i18n = setupI18n({
      locale: lang,
      catalogs,
      locales,
    }) as I18n;
    req.t = req.i18n._.bind(req.i18n);
    next();
  };
}
