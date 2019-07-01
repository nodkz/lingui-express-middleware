# WIP ✋not ready yet

This is a middleware to use lingui-js in express.js.

## Getting started

```bash
yarn add lingui-express-middleware
# or
npm install lingui-express-middleware
```

## wire up i18next to request object

```js
var i18next = require('i18next');
var middleware = require('lingui-express-middleware');
var express = require('express');

i18next.use(middleware.LanguageDetector).init({
  preload: ['en', 'de', 'it'],
  ...otherOptions,
});

var app = express();
app.use(
  middleware.handle(i18next, {
    ignoreRoutes: ['/foo'], // or function(req, res, options, i18next) { /* return true to ignore */ }
    removeLngFromUrl: false,
  })
);

// in your request handler
app.get('myRoute', function(req, res) {
  var lng = req.language; // 'de-CH'
  var lngs = req.languages; // ['de-CH', 'de', 'en']
  req.i18n.changeLanguage('en'); // will not load that!!! assert it was preloaded

  var exists = req.i18n.exists('myKey');
  var translation = req.t('myKey');
});

// in your views, eg. in pug (ex. jade)
div = t('myKey');
```

## add routes

```js
// missing keys; make sure the body is parsed (i.e. with [body-parser](https://github.com/expressjs/body-parser#bodyparserjsonoptions))
app.post('/locales/add/:lng/:ns', middleware.missingKeyHandler(i18next));

// multiload backend route
app.get('/locales/resources.json', middleware.getResourcesHandler(i18next));
```

## add localized routes

You can add your routes directly to the express app

```js
var express = require('express'),
  app = express(),
  i18next = require('i18next'),
  FilesystemBackend = require('i18next-node-fs-backend'),
  i18nextMiddleware = require('lingui-express-middleware'),
  port = 3000;

i18next
  .use(i18nextMiddleware.LanguageDetector)
  .use(FilesystemBackend)
  .init({ preload: ['en', 'de', 'it'], ...otherOptions }, function() {
    i18nextMiddleware.addRoute(
      i18next,
      '/:lng/key-to-translate',
      ['en', 'de', 'it'],
      app,
      'get',
      function(req, res) {
        //endpoint function
      }
    );
  });
app.use(i18nextMiddleware.handle(i18next));
app.listen(port, function() {
  console.log('Server listening on port', port);
});
```

or to an express router

```js
var express = require('express'),
  app = express(),
  i18next = require('i18next'),
  FilesystemBackend = require('i18next-node-fs-backend'),
  i18nextMiddleware = require('lingui-express-middleware'),
  router = require('express').Router(),
  port = 3000;

i18next
  .use(i18nextMiddleware.LanguageDetector)
  .use(FilesystemBackend)
  .init({ preload: ['en', 'de', 'it'], ...otherOptions }, function() {
    i18nextMiddleware.addRoute(
      i18next,
      '/:lng/key-to-translate',
      ['en', 'de', 'it'],
      router,
      'get',
      function(req, res) {
        //endpoint function
      }
    );
    app.use('/', router);
  });
app.use(i18nextMiddleware.handle(i18next));
app.listen(port, function() {
  console.log('Server listening on port', port);
});
```

## Language detection

Detects user language from current request. Comes with support for:

- path
- session
- querystring
- cookie
- header

Wiring up:

```js
var i18next = require('i18next');
var middleware = require('lingui-express-middleware');

i18next.use(middleware.LanguageDetector).init(i18nextOptions);
```

As with all modules you can either pass the constructor function (class) to the i18next.use or a concrete instance.

## Detector Options

```js
{
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
}
```

Options can be passed in:

**preferred** - by setting options.detection in i18next.init:

```js
var i18next = require('i18next');
var middleware = require('lingui-express-middleware');

i18next.use(middleware.LanguageDetector).init({
  detection: options,
});
```

on construction:

```js
var middleware = require('lingui-express-middleware');
var lngDetector = new middleware.LanguageDetector(null, options);
```

via calling init:

```js
var middleware = require('lingui-express-middleware');

var lngDetector = new middleware.LanguageDetector();
lngDetector.init(options);
```

## Adding own detection functionality

### interface

```js
module.exports {
  name: 'myDetectorsName',

  lookup: function(req, res, options) {
    // options -> are passed in options
    return 'en';
  },

  cacheUserLanguage: function(req, res, lng, options) {
    // options -> are passed in options
    // lng -> current language, will be called after init and on changeLanguage

    // store it
  }
};
```

### adding it

```js
var i18next = require('i18next');
var middleware = require('lingui-express-middleware');

var lngDetector = new middleware.LanguageDetector();
lngDetector.addDetector(myDetector);

i18next.use(lngDetector).init({
  detection: options,
});
```

## License

[MIT](./LICENSE)
