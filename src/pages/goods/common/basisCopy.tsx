/**
 * @file 商品管理
 * @author svon.me@gmail.com
 */

import _ from 'lodash';
import React from 'react';
import * as rules from './rules';
import * as Interface from './interface';
import { FormInstance } from 'antd/lib/form';
import AddClass from '../creatGoods/addClass';
import safeSet from '@fengqiaogang/safe-set';
import { Form, Button, Radio, Input, Cascader, Select, Checkbox, InputNumber,Modal, message, Table } from 'antd';
import { goodsCategoryList, goodsSpec, goodsSpecAdd } from 'src/model/goods/goods';
import Upload from 'src/components/upload/index';
import 'src/styles/goods/create.scss';
import Editor from 'src/components/editor/index';
import { layout, tailLayout } from '../creatGoods/specifications';
interface GoodsProps {
  [key: string]: any;
}

const formProps: any = {
  labelCol: {
    style: {
      width: '80px'
    }
  },
  autoComplete: 'off'
};

export default abstract class Goods<Props extends GoodsProps, State extends Interface.Goods> extends React.Component<Props, State> {
  formRef = React.createRef<FormInstance>();
  sizeFormRef = React.createRef<FormInstance>();
  formSpaceName = ''; // 表单命名空间，防止组建重复使用，避免冲突
  constructor(props: Props) {
    super(props);
    this.state = this.stateInit();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeValues = this.onChangeValues.bind(this);
    this.onAddSkuItem = this.onAddSkuItem.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.getComponentRef = this.getComponentRef.bind(this);
    this.addClassOk = this.addClassOk.bind(this);
    this.getGoodsCategoryList = this.getGoodsCategoryList.bind(this);
    this.onAddGoodsHumbnailImg = this.onAddGoodsHumbnailImg.bind(this);
    this.onAddGoodsDetailImg = this.onAddGoodsDetailImg.bind(this);
    this.getGoodsSkuNode = this.getGoodsSkuNode.bind(this);
    this.memberChange = this.memberChange.bind(this);
    this.periodChange = this.periodChange.bind(this);
    this.handleChange = this.handleChange.bind(this); // 规格
    this.getGoodsSpec = this.getGoodsSpec.bind(this); // 规格
    this.specAddNmaeHandle = this.specAddNmaeHandle.bind(this); //
    this.getSizeView = this.getSizeView.bind(this); //
    this.sizeModelFinish = this.sizeModelFinish.bind(this); //
    this.setSizeVal = this.setSizeVal.bind(this); //
  }
  // 初始化 state 数据
  stateInit (): State {
    const state = {
      name: void 0, // 商品名称
      goods_type: Interface.GoodsType.substance, // 商品类型
      goods_sku: [], // 商品规格 this.createSku()
      goods_category: void 0, // 商品类目ID
      detail: void 0, // 商品详情
      freight_price: 0, // 运费
      stock_deduct: Interface.StockDeduct.pay, // 减库存方式
      limit_member: Interface.BuyLimitMember.arbitrarily, // 购买限制方式
      limit_member_value: false,
      limit_period_value: false,
      limit_period: Interface.BuyLimitDate.arbitrarily,   // 购买周期限制方式
      goods_delivery_area: [], // 配送地区
      humbnail_img: [''], // 商品缩略图
      detail_img: [''], // 商品详情图
      status: Interface.GoodsStatus.normal, // 商品状态
      previewVisible: false, // 添加类目
      addClass: '', // 添加类目数据
      producSpecifications: '', // 添加类目数据
      categoryList: [],
      classKey: '',
      isCreate: true,
      selectedItem: void 0,
      specificationsOpt: [],
      nameModalVisible: false,
      sizeModalVisible: false,
      sizeKey: void 0,
      editTbaleIndex: void 0,
      tableList: [],
    };
    return state as State;
  }
  componentDidMount () {
    console.log('加载111111111----------------');
    // this.getGoodsCategoryList();
    // this.getGoodsSpec();
  }
  componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
  }
  // 获取商品类目
  async getGoodsCategoryList() {
    const data = await goodsCategoryList();
    
    this.setState({categoryList: [].concat(data)});
  }
  
  // 获取一个规格数据结构
  private createSku(): Interface.SKU {
    const sku: Interface.SKU = {
      name: '', // 规格名称
      stock: void 0, // 库存
      original_price: void 0, // 商品原价
      cost_price: void 0, // 成本价格(单位分)
      selling_price: void 0, // 售价(分)
      image: '', // 规格图片
      limit_num: void 0, // 购买限制数量
    };
    return sku;
  }
  // 表单提交时
  abstract onSubmit(): void
  // 表单数据变化时
  onChangeValues(data: State): void {
    const state: State = Object.assign({}, this.state);
    // 缓存数据
    _.each(data, (value: any, key: string) => {
      const val = this.transformData<any>(key, value);
      // 兼容数组的数据更新
      safeSet(state, key, val);
    });
    this.setState(state);
  }
  // 数据转换
  transformData<T>(key: string, data: T): T {
    return data;
  }
  // 添加规格数据
  protected onAddSkuItem(): void {
    const skus: Interface.SKU[] = [].concat(this.state.goods_sku);
    skus.push(this.createSku());
    this.setState({ goods_sku: skus });
  }
  protected getFieldValue<T>(key: string): T {
    if (this.formRef) {
      const { current } = this.formRef;
      if (current && current.getFieldValue) {
        const value: T = current.getFieldValue(key);
        return value;
      }
    }
    return void 0;
  }
  // 商品类型
  getGoodsTtypeNode (): React.ReactNode {
    return (<Form.Item name="goods_type" label="商品信息" rules={ rules.required }>
      <Radio.Group>
        <Radio value={ Interface.GoodsType.substance }>
          <span>实物商品</span>
        </Radio>
        <Radio value={ Interface.GoodsType.invented }>
          <span>虚拟商品</span>
        </Radio>
      </Radio.Group>
    </Form.Item>);
  }
  // 商品名称
  getGoodsNameNode (): React.ReactNode {
    const key = 'name';
    const maxLength = 20;
    // 从缓存的数据中获取名称
    const value = this.state[key] || '';
    const suffix = (<span className="font-gray">{_.size(value)}/{maxLength}</span>);
    return (<div className="w350">
      <Form.Item name={ key } label="商品名称" rules={ rules.required }>
        <Input className="wmax" placeholder="请输入商品名称" maxLength={maxLength} suffix={ suffix }/>
      </Form.Item>
    </div>);
  }
  
  // 商品类目
  getGoodsCategoryNode (): React.ReactNode {
    // if (this.state.goods_category) {
    return (<div className="flex">
      <div className="w350">
        <Form.Item name="goods_category" label="商品类目" rules={ rules.required }>
          <Cascader options={this.state.categoryList}
            fieldNames={{value: 'id', label: 'name', children: 'child'}}
            className="wmax" placeholder="请输入商品名称"></Cascader>
        </Form.Item>
      </div>
      <div>
        <div className="ml20">
          <Button type="primary" onClick={this.showDialog}>添加类目</Button>
        </div>
        {this.getAddClassNode()}
      </div>
    </div>);
    // }
    return void 0;
  }
  // 获取规格视图 ================================
  getCategoryView(): React.ReactNode {
    const { selectedItem, specificationsOpt = [] } = this.state;
    return (
      <div>
        <Select value={selectedItem} style={{ width: 200 }} placeholder="请选择商品规格" onChange={this.handleChange}>
          {specificationsOpt.map((item) => (
            <Select.Option key={item.spec_id} value={item.spec_id}>
              {item.spec_name}
            </Select.Option>
          ))}
        </Select>
      </div>
    );
  }
  // 选择规格 select Change
  handleChange(selectedItem): void {
    this.setState({ selectedItem });
  }
  // ajax 商品规格
  async getGoodsSpec() {
    const res = await goodsSpec();
    const specificationsOpt = _.each(res, item => {
      return { spec_id: item.spec_id, spec_name: item.spec_name};
    });
    this.setState({
      specificationsOpt: [].concat(specificationsOpt)
    });
  }
  // 添加规格名称
  specAddNmaeHandle (flag: boolean) {
    this.setState({
      nameModalVisible: flag
    });
  }
  // 添加规格值 弹框显示
  addSizeHandle (flag: boolean, type?: string) {
    if (this.state.selectedItem) {
      this.setState({
        sizeModalVisible: flag,
        sizeKey: Math.random()
      });
    } else {
      if (type) {
        message.error('请先选择规格');
      }
    }
  }
  // 添加规格名称
  async onFinish (spec_name) {
    const {id} = await goodsSpecAdd(spec_name);
    if (id) {
      this.specAddNmaeHandle(false);
      this.getGoodsSpec();
      message.success('添加成功');
    }
  }
  getAddNmaeView():React.ReactNode {
    return (
      <Form {...layout} name="basic" onFinish={(e) => {this.onFinish(e);}}>
        <Form.Item label="规格名称" name="spec_name" rules={[{ required: true, message: '请输入规格名称' }]} >
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">确定</Button>
        </Form.Item>
      </Form>
    );
  }
  // 添加规格值  弹框
  sizeModelFinish (val) {
    const list = this.state.tableList;
    val.spec_id = this.state.selectedItem;
    
    val.uid = Math.random();
    if (this.state.editTbaleIndex === 0 || this.state.editTbaleIndex) {
      list[this.state.editTbaleIndex] = val;
      this.setState({
        tableList: [].concat(list),
        editTbaleIndex: void 0
      });
    } else {
      this.setState({
        tableList: [].concat(list, val)
      });
    }
    this.addSizeHandle(false); //关闭
  }
  getSizeView():React.ReactNode {
    return (
      <Form key={this.state.sizeKey} ref={this.sizeFormRef} {...layout} name="size" onFinish={this.sizeModelFinish}>
        <Form.Item label="规格名称" name="name" rules={[{ required: true }]} >
          <Input  autoComplete="off"/>
        </Form.Item>
        <Form.Item label="成本价" name="cost_price" rules={[{ required: true }]} >
          <Input  autoComplete="off"/>
        </Form.Item>
        <Form.Item label="原价" name="original_price" rules={[{ required: true }]}>
          <Input  autoComplete="off"/>
        </Form.Item>
        <Form.Item label="售价" name="selling_price" rules={[{ required: true }]}>
          <Input  autoComplete="off"/>
        </Form.Item>
        <Form.Item label="库存" name="stock" rules={[{ required: true }]}>
          <Input  autoComplete="off"/>
        </Form.Item>
        {/* <Form.Item label="实际销量" name="sales" rules={[{ required: true }]}>
          <Input  autoComplete="off"/>
        </Form.Item> */}
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">确定</Button>
        </Form.Item>
      </Form>
    );
  }
  tableDel(obj:any) {
    let index:number;
    const tableList = this.state.tableList;
    for (let i = 0; i < tableList.length; i++) {
      if (obj.id === tableList[i].id) {
        index = i;
        break;
      }
    }
    tableList.splice(index, 1);
    this.setState({
      tableList: [].concat(tableList)
    });
  }
  // 编辑显示
  tableEdit(obj:any) {
    this.addSizeHandle(true);
    let index:number;
    const tableList = this.state.tableList;
    for (let i = 0; i < tableList.length; i++) {
      if (obj.id === tableList[i].id) {
        index = i;
        break;
      }
    }
    this.setState({editTbaleIndex: index});
    this.setSizeVal(tableList[index]);
  }
  // 赋值
  setSizeVal(val) {
    setTimeout(() => {
      this.sizeFormRef.current.setFieldsValue({
        name: val.name,
        cost_price: val.cost_price,
        original_price: val.original_price,
        selling_price: val.selling_price,
        stock: val.stock,
        sales: val.sales,
      });
    }, 1000);
    
  }
  getTable():React.ReactNode {
    const columnsItem = [
      {
        title: '规格名称',
        dataIndex: 'name',
      },
      {
        title: '成本价',
        dataIndex: 'cost_price',
        render(text) {
          return <a>￥{text}</a>;
        }
      },
      {
        title: '原价',
        dataIndex: 'original_price',
        render(text) {
          return <a>￥{text}</a>;
        }
      },
      {
        title: '售价',
        dataIndex: 'selling_price',
        render(text) {
          return <a>￥{text}</a>;
        }
      },
      {
        title: '库存',
        dataIndex: 'stock'
      },
      {
        title: '实际销量',
        dataIndex: 'sales'
      },
      {
        title: '操作',
        key: 'id',
        render:(text, record:any)=> {
          return (
            <div>
              <a className="mr20" onClick={() => this.tableEdit(record)}>编辑</a>
              <a onClick={() => this.tableDel(record)}>删除</a>
            </div>
          );
        },
      },
    ];
    if (this.state.tableList && this.state.tableList.length) {
      return (
        <Table bordered dataSource={this.state.tableList} columns={columnsItem} pagination={false} rowKey="uid" size="small" />
      );
    }
    return void 0;
  }
  // 商品规格
  getGoodsSkuNode (index: number): React.ReactNode {
    const key = 'goods_sku';
    const state = this.state;
    // 此处记住 safe-set 方法写入数据
    // 具体逻辑的实现请看 onChangeValues 方法
    const name = `${key}[${index}].name`;
    // const label = (<span>{ index > 0 ? '' : '规格名称' }</span>);
    let add: React.ReactNode;
    if (index === 0) {
      add = (<div className="ml20">
        <Button type="primary">添加规格名称</Button>
      </div>);
    }
    return (
      <div>
        <div className="flex">
          <div className="flex">
            <Form.Item name={ name } label={(index > 0) ? '' : '规格名称' } >
              {this.getCategoryView()}
            </Form.Item>
            <Button className="ml20 mr20" type="primary" onClick={() => {this.specAddNmaeHandle(true);}}>添加规格名称</Button>
            <Button type="primary" onClick={() => {this.addSizeHandle(true, 'add');}}>添加规格值</Button>
          
          </div>
          { add }
        </div>
        <Modal title="商品规格名称" visible={state.nameModalVisible} footer={null} onCancel={() => {this.specAddNmaeHandle(false);}} >
          {this.getAddNmaeView()}
        </Modal>
        <div className="mt20">
          <Modal title="商品规格名称" visible={state.sizeModalVisible} footer={null} onCancel={() => {this.addSizeHandle(false);}} >
            {this.getSizeView()}
          </Modal>
          <div className="mt20">
            {this.getTable()}
          </div>
        </div>
      </div>
    );
    return void 0;
  }
  // ====================================
  private imageFileUploadSuccess(key: string): void {
    const list = [].concat(this.state[key]);
    list.push('');
    const data = {};
    data[key] = list;
    this.setState(data);
  }
  // 商品缩略图
  getGoodsHumbnailImg (index: number, remove?: boolean): React.ReactNode {
    const name = `humbnail_img[${index}]`;
    const label = index === 0 ? '商品缩略图' : void 0;
    const humbnail_img = this.state.humbnail_img;
    if (humbnail_img && humbnail_img.length) {
      return (<Form.Item key={`name${index}`} name={ name } label={ label }>
        <Upload remove={ remove }></Upload>
      </Form.Item>);
    }
    return void 0;
  }
  // 添加商品缩略图
  protected onAddGoodsHumbnailImg(): void {
    const humbnail_img = [].concat(this.state.humbnail_img, '');
    this.setState({ humbnail_img });
  }
  // 商品详情图
  getGoodsDetailImg (index: number, remove?: boolean): React.ReactNode {
    const detail_img = this.state.detail_img;
    const name = `detail_img[${index}]`;
    const label = index === 0 ? '商品详情图' : void 0;
    if (detail_img && detail_img.length) {
      return (<Form.Item key={`name${index}`} name={ name } label={ label }>
        <Upload remove={ remove }></Upload>
      </Form.Item>);
    }
    return void 0;
  }
  // 添加商品详情图
  protected onAddGoodsDetailImg(): void {
    const detail_img = [].concat(this.state.detail_img, '');
    this.setState({ detail_img });
  }
  // 商品详情
  getGoodsDetailNode(): React.ReactNode {
    if (this.state.isCreate) {
      return (
        <Form.Item name="detail" label="商品详情" rules={ rules.required }>
          <Editor value={`${this.state.detail}`}></Editor>
        </Form.Item>
      );
    } else {
      if (this.state.detail && this.state.detail !== `${'<p></p>'}`) {
        return (
          <Form.Item name="detail" label="商品详情" rules={ rules.required }>
            <Editor value={`${this.state.detail}`}></Editor>
          </Form.Item>
        );
      }
    }
    return void 0;
  }
  // 运费设置
  getGoodsFreightPriceNode (): React.ReactNode {
    return (<div className="flex">
      <div>
        <Form.Item name="freight_price" label="统一邮费" rules={ rules.required }>
          <InputNumber min={0}></InputNumber>
        </Form.Item>
      </div>
      <div className="ml20">
        <Button type="primary">编辑配送地区</Button>
      </div>
    </div>);
  }
  // 减库存方式
  getGoodsStockDeductNode (): React.ReactNode {
    return (<Form.Item name="stock_deduct">
      <Checkbox.Group>
        <div>
          <Checkbox value={ Interface.StockDeduct.submit }>
            <span>提交订单减库存方式</span>
          </Checkbox>
        </div>
        <div>
          <Checkbox value={ Interface.StockDeduct.pay }>
            <span className="dibk align-top">
              <span className="dbk">
                <span>付款减库存方式</span>
              </span>
              <span className="dbk">
                <span>商品参加“多人拼团”、“降价拍”活动时吗，默认付款减库存，参加“秒杀”活动时，默认为拍下清库存</span>
              </span>
            </span>
          </Checkbox>
        </div>
      </Checkbox.Group>
    </Form.Item>);
  }
  memberChange(e) {
    this.setState({
      limit_member_value: e.target.checked,
    });
  }
  periodChange(e) {
    this.setState({
      limit_period_value: e.target.checked,
    });
  }
  // 指定用户 限购方式
  getGoodsLimitNode (): React.ReactNode {
    return (<div>
      <div className="flex">
        <div>
          <Form.Item name="limit_member_value">
            {/* <Checkbox.Group> */}
            <Checkbox onChange={this.memberChange} checked={ this.state.limit_member_value }>只允许指定用户购买</Checkbox>
            {/* </Checkbox.Group> */}
          </Form.Item>
        </div>
        <div className="w200">
          <Form.Item name="limit_member">
            <Select showSearch>
              <Select.Option value="1">用户1</Select.Option>
              <Select.Option value="2">用户2</Select.Option>
            </Select>
          </Form.Item>
        </div>
      </div>
      <div className="flex">
        <div>
          <Form.Item name="limit_period_value">
            {/* <Checkbox.Group> */}
            <Checkbox onChange={this.periodChange} checked={ this.state.limit_period_value }>限购周期</Checkbox>
            {/* </Checkbox.Group> */}
          </Form.Item>
        </div>
        <div className="w200">
          <Form.Item name="limit_period">
            <Select showSearch>
              <Select.Option value="1">周期1</Select.Option>
              <Select.Option value="2">周期2</Select.Option>
            </Select>
          </Form.Item>
        </div>
      </div>
    </div>);
  }
  // 商品状态
  getGoodsStatusNode(): React.ReactNode {
    return (<Form.Item name="status" label="商品状态" rules={ rules.required }>
      <Radio.Group>
        <Radio value={ Interface.GoodsStatus.normal }>
          <span>立即上架</span>
        </Radio>
        <Radio value={ Interface.GoodsStatus.prohibit }>
          <span>暂不上架</span>
        </Radio>
      </Radio.Group>
    </Form.Item>);
  }
  // 类目
  getAddClassNode(): React.ReactNode {
    const state: State = this.state;
    // if (state.categoryList && state.categoryList.length) {
    return (
      <Modal title="添加类目" visible={state.previewVisible} onOk={this.addClassOk} onCancel={this.handleCancel}>
        {/* <AddClass categoryList={state.categoryList} getComponentRef={this.getComponentRef}></AddClass> */}
        <AddClass key={state.classKey} getComponentRef={this.getComponentRef}></AddClass>
      </Modal>
    );
    // } 
    // return void 0;
  }
  getFormContent (): React.ReactNode {
    const props = {
      ...formProps,
      layout: 'horizontal',
      ref: this.formRef,
      name: this.formSpaceName,
      onFinish: this.onSubmit,
      onValuesChange: this.onChangeValues
    };
    return (<Form { ...props }>
      <div>
        <div>基础信息</div>
        <div className="pt10">
          { this.getGoodsTtypeNode() /** 商品信息 */ }
          { this.getGoodsNameNode() /** 商品名称 */ }
          { this.getGoodsCategoryNode() /** 商品类目 */ }
        </div>
      </div>
      <div>
        <div>商品规格</div>
        <div className="pt10">
          <div>
            {/* { 
              _.map(this.state.goods_sku, (item: Interface.SKU, index: number) => {
                return <div key={ `sku-${index}` }>
                  { this.getGoodsSkuNode(index) }
                </div>;
              })
            } */}
            {
              this.getGoodsSkuNode(1)
            }
          </div>
          <div>
            {/* <span>规格表格...</span> */}
            <br/>
            <br/>
            <br/>
            <br/>
          </div>
        </div>
        {/* <div>
          <Button type="primary" onClick={ this.onAddSkuItem }>添加规格</Button>
        </div> */}
        <div className="pt20 flex">
          <div className="flex">
            {
              _.map(this.state.humbnail_img, (src: string, index: number) => {
                return (<div key={ index }>
                  { this.getGoodsHumbnailImg(index, index > 0) }
                </div>);
              })
            }
            <div>
              <Button onClick={ this.onAddGoodsHumbnailImg }>添加商品缩略图</Button>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex">
            {
              _.map(this.state.detail_img, (src: string, index: number) => {
                return (<div key={ index }>
                  { this.getGoodsDetailImg(index, index > 0) }
                </div>);
              })
            }
            <div>
              <Button onClick={ this.onAddGoodsDetailImg }>添加商品详情图</Button>
            </div>
          </div>
        </div>
        <div className="pt20">
          { this.getGoodsDetailNode() /** 商品详情 */ }
        </div>
      </div>
      <div>
        <div>物流配置</div>
        <div className="pt10">
          { this.getGoodsFreightPriceNode() /** 邮费设置 */ }
        </div>
      </div>
      <div>
        <div>库存扣减方式</div>
        <div className="pt10">
          { this.getGoodsStockDeductNode() /** 减库存方式 */ }
        </div>
      </div>
      <div>
        <div>限购</div>
        <div className="pt10">
          { this.getGoodsLimitNode() /** 限购方式 */ }
        </div>
      </div>
      <div>
        <div>上下架</div>
        <div className="pt10">
          { this.getGoodsStatusNode() /** 设置商品状态 */ }
        </div>
      </div>
      <div className="pt20">
        <Form.Item>
          <Button type="primary" htmlType="submit">保存</Button>
        </Form.Item>
      </div>
    </Form>);
  }
  /** 添加类目 ---------------------------- */
  handleCancel (){
    this.setState({ previewVisible: false });
  }
  showDialog() {
    this.setState({
      classKey: Math.random(),
      previewVisible: true
    });
  }
  getComponentRef(type, ref) {
    switch (type) {
    case 'addClass':
      this.setState({
        addClass: ref
      });
      break;
    case 'category':
      this.setState({
        producSpecifications: ref
      });
      break;
  
    default:
      break;
    }
  }
  addClassOk() {
    console.log('1');
    
  }
  /** 添加类目 ---------------------------- */
  render(): React.ReactElement {
    return (
      <div>
        <div>{ this.getFormContent() }</div>
        
      </div>);
  }
}