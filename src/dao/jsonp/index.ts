/**
 * @file jsonp
 * @author svon.me@gmail.com
 */

import _ from 'lodash';
import Url from 'url';

interface Query {
  [key: string]: any;
}
const jsonp = function<T>(api: string, query?: Query): Promise<T> {
  if (!api) {
    return Promise.reject(new Error('api 不能为空'));
  }
  const url = Url.parse(api, true);
  const callbackName = _.uniqueId('jsonpCallback');
  const param = _.assign({}, url.query, query || {}, {
    callback: callbackName
  });
  const queryArray = [];
  _.each(param, function(value: string, key: string) {
    queryArray.push(`${key}=${value}`);
  });
  const JSONP = document.createElement('script');
  JSONP.type = 'text/javascript';
  JSONP.src = `${url.protocol}//${url.host}${url.pathname}?${queryArray.join('&')}`;
  return new Promise(function(resolve) {
    window[callbackName] = function(result: T): void {
      resolve(result);
    };
    document.getElementsByTagName('head')[0].appendChild(JSONP);
  });
};

export default jsonp;