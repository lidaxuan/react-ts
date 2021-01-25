/**
 * @file 趣产品配置文件
 * @author svon.me@gmail.com
 */

export interface Domains {
  base: string; // 主域名
  www: string; // 官网
  center: string; // 个人中心
  core: string; // 公共
  mc: string; // 营销
  monitor: string;
  report: string;
  [key: string]: any;
}

export interface Api {
  host: string; // 接口地址
  basePath: string; // 主路径
  userdetail: string; // 个人信息接口地址
  success: number; // 完成状态码
  token: string; // token 名称
  uid: string; // 用户 id 名称
  [key: string]: any;
}

export interface Config {
  api: Api;
  domains: Domains;
}

const config: Config = {
  api: void 0,
  domains: void 0 
};

export const setConfig = function(value: Config): void {
  config.api = value.api;
  config.domains = value.domains;
};

export const getConfig = function(): Config {
  return config;
};