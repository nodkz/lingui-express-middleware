import express from 'express';
import { lingui } from '../../../src/index';
import loadCatalogs from './loadCatalogs';

const PORT = process.env.PORT || 3333;
const app = express();

// const catalogs = {
//   ru: require('../locales/ru/messages'),
//   en: require('../locales/en/messages'),
//   kk: require('../locales/kk/messages'),
// };
// OR
const catalogs = loadCatalogs();

app.use(lingui(catalogs));

app.get('/', function(req, res) {
  res.send(`
    Switch lang: ${[...req.i18n.locales].map((l) => `<a href="?lang=${l}">${l}</a> `).join(' ')}
    <br/>
    Current language: ${req.lang}
    <br/>
    ${req.i18n._('welcome')}
    <br/>
    ${req.t('welcome')}
  `);
});

app.listen(PORT, () => {
  console.log(`🚀  Server ready at http://localhost:${PORT}`);
});
