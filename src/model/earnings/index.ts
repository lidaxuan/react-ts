/*
 * @Author: MrZhang
 * @Date: 2021-01-19 09:31:01
 * @Description:收益列表
 */
import _ from 'lodash';
import { axios } from '../../dao/index';

// 主播列表
export function anchorList(): Promise<any> {
  return axios.post('/anchor/list');
}

// 收益列表
export function profitList(query): Promise<any> {
  return axios.get('/profit/list', { params: query });
}

// 导出
export function profitExport(query): Promise<any> {
  return axios.post('/profit/export', query);
}


