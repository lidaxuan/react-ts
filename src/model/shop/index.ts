import _ from 'lodash';
import { axios } from '../../dao/index';
//banner详情
export function bannerInfo(): Promise<any> {
  return axios.get('/shop/banner');
}
//banner更新
export function bannerEdit(query): Promise<any> {
  return axios.post('/shop/banner', query);
}
//直播间列表
export function studioList(query): Promise<any> {
  return axios.post('/studio/list', query);
}