/**
 * @file 创建 axios 对象
 * @author 15201002062@163.com
 */

import _ from 'lodash';
import server from './server';
import { headers } from '../headers';
import { Success } from '../response';
import sefaSet from '@fengqiaogang/safe-set';
import Qs from 'qs';

// 发送前触发
server.interceptors.request.use(function (config) {
  const method = _.toLower(config.method);
  if (_.includes(method, "post") && config.url !== '/upload/image') {
    config.data = Qs.stringify(config.data);
    sefaSet(config, 'headers.Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  }
  if (_.includes(config.url, '/upload/image')) {
    sefaSet(config, 'headers.Content-Type', 'multipart/form-data;');
  }
  _.each(headers(config as any), (value, key) => {
    sefaSet(config, `headers.${key}`, value);
  });
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 响应前触发
server.interceptors.response.use( response => {
  if (response.status === 200 || response.statusText === 'ok') {
    return Success(response.data ? response.data : response);
  }
  return response;
},  error => {
  return Promise.reject(error);
});


export default server;