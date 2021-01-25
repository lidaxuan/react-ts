/**
 * @file 获取趣产品配置文件
 * @author svon.me@gmail.com
 */

import _ from 'lodash';
import process from 'src/env';
import jsonp from 'src/dao/jsonp/index';
import { Config } from 'src/utils/quclouds';

export const getQuCloudsConfig = function(query: any): Promise<Config> {
  const api = process.env.quclouds;
  return jsonp(api, query);
};