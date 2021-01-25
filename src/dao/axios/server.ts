
/**
 * @file 创建 axios 对象
 * @author 15201002062@163.com
 */


import axios from 'axios';
import process from 'src/env/index';

const timeout: number = 5000 * 10;

const option = {
  timeout,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  },
  withCredentials: false, // 不发送 cookie
  baseURL: `${process.env.api}/api`, // 默认域名
};

const server = axios.create(option);

export default server;