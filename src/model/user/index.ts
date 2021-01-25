/*
 * @Description: 
 * @Author: 李继玄（15201002062@163.com）
 * @Date: 2020-12-29 13:45:23
 * @FilePath: /react-ts-antvg6/src/model/user/index.ts
 */
/**
 * @file 用户信息
 * @author svon.me@gmail.com
 */

import { axios } from 'src/dao/index';
import { getConfig, Api } from 'src/utils/quclouds';

export const getUser = async function() {
  const config = getConfig();
  const api: Api = config.api;
  const url = `${api.host}${api.basePath}${api.userdetail}`;
  try {
    const user = await axios.get(url);
    console.log(user);
    
    return user;
  } catch (error) {
    return void 0;
  }
};