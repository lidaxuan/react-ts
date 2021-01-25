/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-05-15 09:37:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-22 17:23:57
 * @FilePath: /react-ts-antvg6/src/utils/cache.js
 */
import storage from 'good-storage';

/**
 * 设置本地存储
 * @param key
 * @param value
 * @param timeout seconds
 * @returns {*}
 */
export function saveStorage(key, value, timeout) {
  let toSave = {
    value: value,
    __saveTime: new Date().getTime,
    __timeout: timeout
  };
  storage.set(key, JSON.stringify(toSave));
  return value;
}

/**
 * 获取本地存储
 * @param key
 * @param defaultValue
 * @returns {*}
 */
export function loadStorage(key, defaultValue) {
  let v = storage.get(key, null);
  if (v) {
    v = JSON.parse(v);
    if (v.__timeout) {
      if ((new Date().getTime() - v.__saveTime) > v.__timeout) {
        return defaultValue;
      }
    }
    return v.value;
  }
  return defaultValue;
}

/**
 * 删除本地存储
 * @param key
 * @returns {string}
 */
export function removeStorage(key) {
  storage.remove(key);
  return '';
}

/**
 * 保存会话存储
 * @param key
 * @param value
 * @returns {*}
 */
export function saveSessionStorage(key, value) {
  storage.session.set(key, value);
  return value;
}

/**
 * 获取会话存储
 * @param key
 * @param defaultValue
 * @returns {*}
 */
export function loadSessionStorage(key, defaultValue) {
  return storage.session.get(key, defaultValue);
}

/**
 * 删除会话存储
 * @param key
 * @returns {string}
 */
export function removeSessionStorage(key) {
  storage.session.remove(key);
  return '';
}
