/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-07-06 17:53:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-22 18:11:06
 * @FilePath: /react-ts-antvg6/src/command/storage.js
 */
// import { saveStorage, loadStorage } from '@/utils/cache.js';
import { saveSessionStorage, loadSessionStorage, removeSessionStorage } from '../utils/cache.js';

let id = getQueryVariable('id');
const editId = getQueryVariable('editId');
const name = id || editId;

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] === variable) { return pair[1]; }
  }
  return (false);
}
export function loadStore() {
  const res = loadSessionStorage(name);
  return res;
}

export function saveStore(data) {
  saveSessionStorage(name, data);
}
export function removeStore(data) {
  removeSessionStorage(name, data);
}
