/**
 * @file 创建 axios 对象
 * @author 15201002062@163.com
 */

import _ from 'lodash';
import cookie from 'js-cookie';
import { getConfig } from 'src/utils/quclouds';

interface Headers {
  token?: string;
  uid?: string | number;
  [key: string]: any;
}

interface Option extends Headers {
  url: string;
}

export function headers(option?: Option): Headers {
  const config = getConfig();
  if (config.api) {
    const api = config.api;
    const token = cookie.get(api.token);
    const data = {};
    if (token) {
      Object.assign(data, { token });
    }
    // 需要根据接口调整逻辑
    if (option && _.includes(option.url, config.api.host)) {
      const uid = cookie.get(api.uid) || cookie.get('uid');
      if (uid) {
        Object.assign(data, { uid });
      }
    } else {
      Object.assign(data, { uid: 1 });
    }
    return data;
  }
  // 默认数据
  return { uid: 1 };
}