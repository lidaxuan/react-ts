/*
 * @Description: 商品接口
 */
import _ from 'lodash';
import { axios } from '../../dao/index';

// 商品列表
export function goodsList(query): Promise<any> {
  // const data = {};
  // _.each(query, function(value, key) {
  //   if (value) {
  //     data[key] = value;
  //   }
  // });
  
  return axios.get('/goods/list', { params: _.pickBy(query) });
}

// 商品列表-批量上下架
export function goodsStatus(query): Promise<any> {
  return axios.post('/goods/status', query);
}

// 商品列表-删除
export function goodsDel(query): Promise<any> {
  return axios.post('/goods/del', query);
}

// 商品列表-复制
export function goodsCopy(id): Promise<any> {
  return axios.get(`/goods/clone/${id}`);
}

// 商品列表-单字段修改
export function goodsSingle(query): Promise<any> {
  return axios.post('/goods/sku/field/upd', query);
}

// 获取商品类目
export function goodsCategoryList(): Promise<any> {
  return axios.get('/goods/category/list' );
}

// 添加类目
export function goodsCategoryAdd(query): Promise<any> {
  return axios.post('/goods/category/add', query);
}

// 删除类目
export function goodsCategoryDel(query): Promise<any> {
  return axios.post('/goods/category/del', query);
}

// 添加规格名称
export function goodsSpecAdd(query): Promise<any> {
  return axios.post('/goods/spec/add', query);
}

// 地区
export function getArea(): Promise<any> {
  return axios.get('/area' );
}

// 规格下拉
export function goodsSpec(): Promise<any> {
  return axios.get('/goods/spec/list');
}

// 商品标签下拉
export function goodsLabel(): Promise<any> {
  return axios.get('/goods/label/list');
}

// 添加商品
export function goodsAdd(query): Promise<any> {
  return axios.post('/goods/add', query);
}

// 商品编辑
export function goodsEdit(query): Promise<any> {
  return axios.post('/goods/edit', query);
}

// 商品详情
export function goodsDetial(id): Promise<any> {
  return axios.get(`/goods/detail/${id}`);
}

// 从直播删除
export function goodsLiveDel(query): Promise<any> {
  return axios.post('/live/goods/del', query);
}

// 提交审核
export function goodsAudit(query): Promise<any> {
  return axios.post('/live/goods/audit', query);
}

// 导出
export function exportList(query): Promise<any> {
  return axios.post('/goods/export', query);
}

// 主播列表
export function anchorList(): Promise<any> {
  return axios.post('/anchor/list');
}