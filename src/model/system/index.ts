/*
 * @Author: MrZhang
 * @Date: 2021-01-07 16:52:44
 * @Description: 系统管理接口
 */
import _ from 'lodash';
import { axios } from '../../dao/index';

// 商户详情
export function groupInfo(): Promise<any> {
  return axios.get('/merchant/info');
}

// 城市列表
export function cityFor(): Promise<any> {
  return axios.get('/area');
}

// 商户编辑
export function groupEdits(query): Promise<any> {
  return axios.post('/merchant/info', query);
}


// 分享编辑
export function share(query): Promise<any> {
  return axios.post('/merchant/share', query);
}


// 售后编辑
export function refund(query): Promise<any> {
  return axios.post('/merchant/refund', query);
}

