/**
 * @file 用户信息
 * @author svon.me@gmail.com
 */

import cookie from 'js-cookie';
import { getConfig } from './quclouds';


// 刷新用户令牌时效
export const updateSession = function(): void {
  // 获取配置信息
  const config = getConfig();
  const api = config.api;
  if (api) {
    const time = Date.now() + (1000 * 60 * 30);
    const token = cookie.get(api.token);
    if (token) {
      cookie.set(api.token, token, new Date(time));
    }
    const uid = cookie.get(api.uid);
    if (uid) {
      cookie.set(api.uid, uid, new Date(time));
    }
  }
};