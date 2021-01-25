/**
 * @file 添加商品
 */

import _ from 'lodash';
import GoodsBasis from './common/basis';
import * as Interface from './common/interface';
import { goodsAdd } from 'src/model/goods/goods';
import { browserHistory } from 'react-router';

export default class Create extends GoodsBasis<any, any> {
  async componentDidMount () {
    super.componentDidMount(); // 执行父元素方法
    // todo 执行其他逻辑
  }
  async onSubmit() {
    // 获取表单中所有数据
    const data = this.getFieldsValue();
    const state: Interface.Goods = this.transformData(data);
    // 清除空数据
    state.detail_img = _.compact(state.detail_img);
    state.humbnail_img = _.compact(state.humbnail_img);

    console.log(state);

    // // this.state.goods_category = 1
    // let obj = {..._.cloneDeep(this.state)};
    // obj.goods_category = _.last(obj.goods_category);
    // obj.freight_price = obj.freight_price * 100;
    // obj.stock_deduct = _.first(obj.stock_deduct);
    // obj.limit_member = (_.first(obj.limit_member));
    // obj.limit_period = (_.first(obj.limit_period));
    // obj.categoryList = JSON.stringify(obj.categoryList);
    // obj.goods_sku = JSON.stringify(obj.tableList);
    // obj.humbnail_img = obj.humbnail_img[0];
    // // obj.humbnail_img = '';
    // obj.detail_img = obj.detail_img[0];
    // // obj.detail_img = '';

    // // let a  = obj.goods_category[0];
    // obj = _.omit(obj, ['addClass', 'producSpecifications','tableList', 'categoryList', 'classKey']);
    // console.log(obj);
    
    // const { id } = await goodsAdd(obj);
    // if (id) {
    // 回到上一页
    browserHistory.goBack();
    // }
    
  }
}
