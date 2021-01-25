/**
 * @file 编辑商品
 */

import _ from 'lodash';
import { goodsDetial, goodsCategoryList, goodsEdit } from 'src/model/goods/goods';
import DB from '@fengqiaogang/dblist';
import GoodsBasis from './common/basis';
// const formProps: any = {
//   labelCol: {
//     style: {
//       width: '120px'
//     }
//   }
// };
export default class Edit extends GoodsBasis<any, any> {
  async onSubmit() {
    // this.state.goods_category = 1
    let obj = {..._.cloneDeep(this.state)};
    obj.goods_category = _.last(obj.goods_category);
    obj.freight_price = obj.freight_price * 100;
    obj.stock_deduct = _.first(obj.stock_deduct);
    obj.limit_member = (_.first(obj.limit_member));
    obj.limit_period = (_.first(obj.limit_period));
    obj.categoryList = JSON.stringify(obj.categoryList);
    obj.goods_sku = JSON.stringify(obj.tableList);
    // obj.humbnail_img = obj.humbnail_img[0];
    obj.humbnail_img = '';
    // obj.detail_img = obj.detail_img[0];
    obj.detail_img = '';

    // let a  = obj.goods_category[0];
    obj = _.omit(obj, ['addClass', 'producSpecifications','tableList', 'categoryList', 'classKey']);
    console.log(obj);
    
    const { id } = await goodsEdit(obj);
    if (id) {
      window.history.back();
    }
  }
  // 提交
  constructor(props) {
    super(props);
    this.state = {};
    this.getCategory = this.getCategory.bind(this);
  }
  async componentDidMount () {
    super.componentDidMount(); // 执行父元素方法
    const res = await this.stateInit();
    this.setState({...res});
    this.setState({
      categoryList: [].concat(this.state.categoryList),
    });
    if (this.formRef) {
      const { current } = this.formRef;
      if (current) {
        // 表单回填
        current.setFieldsValue(res);
      }
    }
    this.getGoodsCategoryList();
    this.setState({
      detail: res.detail
    });
  }
  
  getCategory(categoryId: number): Array<any> {
    const categoryList = this.state.categoryList;
    const emptyDb = new DB([], 'id');
    const newArr = emptyDb.flatten(categoryList, 'child');
    const db = new DB(newArr, 'id', 'pid');
    const current = _.first(db.select({id: categoryId}));
    console.log(current);
    const par = _.first(db.select({id: current['pid'] || ''}));
    if (par && _.keys(par).length) {
      return [par['id']];
    }
    return [];

  }
  async stateInit () {
    const id = this.props.location.query.id;
    const res = await goodsDetial(id);
    const category = this.getCategory(res.goods_category);
    _.map(res.goods_sku, (item, index) => {
      item.uid = index;
    });
    const state = {
      name: res.name, // 商品名称
      goods_type: res.goods_type, // 商品类型
      goods_sku: res.goods_sku, // 商品规格
      tableList: res.goods_sku, // 商品规格
      goods_category: [].concat(category, res.goods_category), // 商品类目ID
      detail: `${res.detail}`, // 商品详情
      freight_price: res.freight_price / 100, // 运费
      stock_deduct: [].concat(res.stock_deduct), // 减库存方式
      limit_member: [].concat(res.limit_member + ''), // 购买限制方式
      limit_period: [].concat(res.limit_period + ''),   // 购买周期限制方式
      goods_delivery_area: [], // 配送地区
      humbnail_img: [].concat(res.humbnail_img), // 商品缩略图
      detail_img: [].concat(res.detail_img), // 商品详情图
      status: res.status, // 商品状态
      previewVisible: false, // 添加类目
      addClass: '', // 添加类目数据
      categoryList: [],
      classKey: '',
      limit_member_value: false,
      limit_period_value: false,
      isCreate: false,
      id: res.id
    };
    console.log(state);
    
    if (res.limit_member) {
      state.limit_member_value = true;
    } else {
      state.limit_member = [];
    }
    if (res.limit_period) {
      state.limit_period_value = true;
    } else {
      state.limit_period = [];
    }
    console.log(state);
    
    return state;
  }
}

