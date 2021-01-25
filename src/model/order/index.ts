/*
 * @Author: MrZhang
 * @Date: 2020-12-28 17:54:58
 * @Description: 订单接口
 */
import _ from 'lodash';
import { axios } from 'src/dao/index';
import { Parmas } from 'src/utils/interface';

export const getOrderList = function <T>(query: Parmas): Promise<T> {
  // pickBy 可以将对象中的空值去掉
  return axios.get(`/order/list`, { params: _.pickBy(query) });
};


export const getOrderDtail = function <T>(id: string | number): Promise<T> {
  return axios.get(`/order/detail/${id}`);
};

export const getArea = function <T>(): Promise<T> {
  return axios.get(`/area`);
};

//模板下载
export const templatedownload = function <T>(query): Promise<T> {
  return axios.post("/template", query);
};
//订单导出
export const orderExport = function <T>(query): Promise<T> {
  return axios.post("/order/export", query);
};
//物流导入
export const logisticsExport = function <T>(query): Promise<T> {
  return axios.post("/order/logistics/import", query);
};


//快递公司
export const express = function <T>(query): Promise<T> {
  return axios.get("/express", { params: query });
};

//编辑买家收货地址
export const editAddress = function <T>(params: Parmas): Promise<T> {
  return axios.post(`/order/address`, params);
};
//更新物流
export const logisticsUpdate = function <T>(params: Parmas): Promise<T> {
  return axios.post(`/order/logistics/update`, params);
};

// 城市列表
export function cityFor(): Promise<any> {
  return axios.get('/area');
}

// 申请详情
export function applyDetail(query: Parmas): Promise<any> {
  return axios.get('/order/refund/apply', { params: query });
}
// 审核处理
export function auditDispose(query): Promise<any> {
  return axios.post('/order/refund/submit', query);
}

// 商户详情
export function groupInfo(): Promise<any> {
  return axios.get('/merchant/info');
}
// 订单物流
export function logistics(query): Promise<any> {
  return axios.get('/order/logistics/detail', { params: query });
}
// 退款
export function refundConfirm(query): Promise<any> {
  return axios.post('/order/refund/confirm', query);
}