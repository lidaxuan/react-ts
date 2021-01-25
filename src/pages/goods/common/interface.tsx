/**
 * @file 商品
 * @author svon.me@gmail.com
 */

// 商品类型
export enum GoodsType {
  substance = 1, // 实物，需要物流发货
  invented = 2   // 虚拟，电子形式的商品
}

export enum StockDeduct {
  submit = 1, // 提交订单减库存
  pay = 2     // 付款减库存
}

// 是否限制购买
export enum BuyLimitMember {
  arbitrarily = 0,  // 不限制
  limit = 1,        // 限制
}

// 是否限制时间
export enum BuyLimitDate {
  arbitrarily = '0',  // 不限
  limit = '1',        // 限制
}

// 商品状态
export enum GoodsStatus {
  normal = 1,   // 上架 
  prohibit = 2, // 下架
  sellOut = 3   // 已售罄
}


// 商品规格
export interface SKU {
  id?: string | number; // 规格ID
  name: string; // 规格名称
  stock: number; // 库存
  original_price: number; // 商品原价
  cost_price: number; // 成本价格(单位分)
  selling_price: number; // 售价(分)
  image: string; // 规格图片
  limit_num: number; // 购买限制数量
  use_stock?: number; // 减库存(我也不明白)
}
// 配送地区
export interface GoodsDelivery {
  province_code: string | number; // 省份ID
  city_code: string | number;     // 城市ID
  area_code: string | number;     // 区县ID
}


export interface Goods {
  id?: string | number; // 商品ID
  name: string; // 商品名称
  goods_type: GoodsType; // 商品类型
  goods_sku: Array<SKU>; // 商品规格
  goods_category: string | number; // 商品类目ID
  detail: string; // 商品详情
  freight_price: number; // 运费
  stock_deduct: StockDeduct; // 减库存方式
  limit_member: BuyLimitMember; // 购买限制方式
  limit_period: BuyLimitDate;   // 购买周期限制方式
  goods_delivery_area: Array<GoodsDelivery>; // 配送地区
  humbnail_img: Array<string>; // 商品缩略图
  detail_img: Array<string>; // 商品详情图
  status: GoodsStatus; // 商品状态
  previewVisible: boolean; // 添加类目
  addClass: any;
  producSpecifications: any;
  categoryList: Array<any>;
  classKey: number | string;
  limit_member_value: boolean;
  limit_period_value: boolean;
  isCreate: boolean;
  selectedItem: string | number;
  specificationsOpt: Array<any>;
  nameModalVisible: boolean;
  sizeModalVisible: boolean;
  sizeKey: any;
  tableList:  Array<any>;
  editTbaleIndex: number,
  [key: string]: any;
}



export interface CategoryOpt {
  spec_id: string | number; // ID
  spec_name: string | number;  // 属性名	
}