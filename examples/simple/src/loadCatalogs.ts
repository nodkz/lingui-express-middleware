import { getConfig } from '@lingui/conf';
import { getCatalogs } from '@lingui/cli/api';
import { Catalogs } from '@lingui/core';

export default function loadCatalogs(): Catalogs {
  const conf = getConfig();
  const catalogsData = getCatalogs(conf);
  const catalogs = {};
  catalogsData[0].locales.forEach((lc) => {
    catalogs[lc] = {
      messages: catalogsData[0].getTranslations(lc, conf),
      // localeData: how to obtain?
    };
  });
  return catalogs;
}
