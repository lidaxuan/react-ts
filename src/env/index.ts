/**
 * @file 坏境信息
 * @author svon.me@gmail.com
 */

import URL from 'url';

const env = {
  NODE_ENV: 'production', // 默认为线上环境
  BASE_URL: '/',  // 路由根地址
  Token_Name: 'token', // token 名称
  quclouds: '', // 趣系列产品配置文件
  domain: '', // 当前系统域名
};
const option = {
  env: Object.assign({}, env, process.env)
};
if (/^\/\//i.test(option.env.BASE_URL)) {
  const baseUrl = `${window.location.protocol}${option.env.BASE_URL}`;
  const url = URL.parse(baseUrl);
  option.env.BASE_URL = url.pathname;
}


if (/^\/\//i.test(option.env.VUE_APP_API_Domain)) {
  option.env.VUE_APP_API_Domain = `${window.location.protocol}${option.env.VUE_APP_API_Domain}`;
}
export default option;