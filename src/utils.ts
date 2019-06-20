export function setPath(object: any, path: string, newValue: any) {
  let stack;
  if (typeof path !== 'string') stack = [].concat(path);
  else if (typeof path === 'string') stack = path.split('.');
  else return;

  while (stack.length > 1) {
    let key = stack.shift();
    if (!key) continue;
    if (key.indexOf('###') > -1) key = key.replace(/###/g, '.');
    if (!object[key]) object[key] = {};
    object = object[key];
  }

  let key = stack.shift();
  if (!key) return;
  if (key.indexOf('###') > -1) key = key.replace(/###/g, '.');
  object[key] = newValue;
}

let arr: [] = [];
let each = arr.forEach;
let slice = arr.slice;

export function defaults(obj: any) {
  each.call(slice.call(arguments, 1), (source: any) => {
    if (source) {
      for (var prop in source) {
        if (obj[prop] === undefined) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

export function removeLngFromUrl(url: string, lookupFromPathIndex: number) {
  let first = '';
  let pos = lookupFromPathIndex;

  if (url[0] === '/') {
    pos++;
    first = '/';
  }

  // Build new url
  let parts = url.split('/');
  parts.splice(pos, 1);
  url = parts.join('/');
  if (url[0] !== '/') url = first + url;

  return url;
}
