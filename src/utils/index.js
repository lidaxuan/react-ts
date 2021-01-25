/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-07-06 17:53:08
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-22 17:58:49
 * @FilePath: /react-ts-antvg6/src/utils/index.js
 */ 

import {v4 as UUId} from 'uuid';
export { merge, pick, upperFirst } from 'lodash';

export const uniqueId = UUId;

export const toQueryString = function(data) {
  const keys = Object.keys(data);
  const array = keys.map(key => {
    const name = encodeURIComponent(key);
    const vlaue = encodeURIComponent(data[key]);
    return `${name}=${vlaue}`;
  });
  return array.join('&');
};

export const addListener = function(target, eventName, handler) {
  if (typeof handler === 'function') {
    return target.on(eventName, handler);
  }
};

export const getBox = function(x, y, width, height) {
  const x1 = (x + width) < x ? (x + width) : x;
  const x2 = (x + width) > x ? (x + width) : x;
  const y1 = (y + height) < y ? (y + height) : y;
  const y2 = (y + height) > y ? (y + height) : y;
  return {
    x1, x2, y1, y2
  };
};

export const dateFormat = function (fmt, date) {
  let ret;
  let opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
  };
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'));
    }
  }
  return fmt;
};