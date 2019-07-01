import pathDetector, { PathOptions } from './detectors/path';
import sessionDetector, { SessionOptions } from './detectors/session';
import querystringDetector, { QuerystringOptions } from './detectors/querystring';
import cookieDetector, { CookieOptions } from './detectors/cookie';
import headerDetector, { HeaderOptions } from './detectors/header';
import { Detector } from './types';
import { Request, Response } from 'express';
import { negotiateLanguages } from 'fluent-langneg';

export type DetectorNames = 'path' | 'session' | 'querystring' | 'cookie' | 'header';

export interface LanguageDetectorOptions
  extends PathOptions,
    SessionOptions,
    QuerystringOptions,
    CookieOptions,
    HeaderOptions {
  order: DetectorNames[];
  caches: ('cookie' | 'session')[] | false;
  defaultLocale: string;
  availableLocales: string[];
}

function getDefaults(): LanguageDetectorOptions {
  return {
    order: [/*'path', 'session', */ 'querystring', 'cookie', 'header'],
    caches: ['cookie'], // ['cookie', 'session'] or false // cache user language
    defaultLocale: 'en',
    availableLocales: ['en'],

    lookupPath: 'lang', // named param
    lookupFromPathIndex: 0, // by index of splitted path

    lookupSession: 'lang',

    lookupQuerystring: 'lang',

    lookupCookie: 'lang',
    // cookieExpirationDate: new Date(), // by default 1 year
    // cookieDomain: 'myDomain',
    // cookieSecure: true,

    lookupHeader: 'accept-language', // by default 'accept-language'
  };
}

class LanguageDetector {
  detectors: { [key: string]: Detector } = {};
  options: LanguageDetectorOptions;

  constructor(options: Partial<LanguageDetectorOptions> = {}) {
    this.options = { ...getDefaults(), ...options };
    this.addDetector(cookieDetector);
    this.addDetector(querystringDetector);
    this.addDetector(pathDetector);
    this.addDetector(headerDetector);
    this.addDetector(sessionDetector);
  }

  addDetector(detector: Detector) {
    this.detectors[detector.name] = detector;
  }

  lookup(req: Request, res: Response): string[] | void {
    if (arguments.length < 2) return;
    const detectionOrder = this.options.order;

    for (const detectorName of detectionOrder) {
      if (!this.detectors[detectorName]) continue;

      let detections = this.detectors[detectorName].lookup(req, res, this.options);
      if (detections) {
        return Array.isArray(detections) ? detections : [detections];
      }
    }
  }

  detect(req: Request, res: Response): string {
    const detections = this.lookup(req, res);
    if (!detections) return this.options.defaultLocale;

    const availableLocales = this.options.availableLocales;
    if (!availableLocales) return detections[0];

    const supported = negotiateLanguages(detections, availableLocales, {
      strategy: 'lookup',
      defaultLocale: this.options.defaultLocale,
    });
    if (supported && supported[0]) return supported[0];

    return this.options.defaultLocale;
  }

  cacheUserLanguage(req: Request, res: Response, lang: string) {
    const caches = this.options.caches;
    if (!caches) return;
    caches.forEach((cacheName) => {
      const detector = this.detectors[cacheName];
      if (!detector) return;
      if (detector.cacheUserLanguage) {
        detector.cacheUserLanguage(req, res, lang, this.options);
      }
    });
  }
}

export default LanguageDetector;
