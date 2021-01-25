import _ from 'lodash';
import React, { Component } from 'react';
import Upload from 'src/components/upload/index';
import { FormInstance } from 'antd/lib/form';
import '../../styles/goods/operation.scss';
import { Form, Input, Button, Checkbox, Cascader, Select, Table, Modal, message, Radio, InputNumber, TreeSelect } from 'antd';
import checked from 'static/images/checked.png';
import safeSet from '@fengqiaogang/safe-set';
import { goodsCategoryList, goodsSpec, goodsSpecAdd, getArea, goodsLabel, goodsAdd, goodsDetial, goodsEdit, anchorList } from 'src/model/goods/goods';
import { PlusOutlined, DeleteTwoTone } from '@ant-design/icons';
import AddClass from './creatGoods/addClass';
import Editor from 'src/components/editor/index';
const { SHOW_PARENT } = TreeSelect;
import DB from '@fengqiaogang/dblist';
import { browserHistory } from 'react-router';
// 商品类型
// enum GoodsType {
//   substance = 1, // 实物，需要物流发货
//   invented = 2   // 虚拟，电子形式的商品
// }
interface FormData {
  id?: number | string;
  // goods_type: GoodsType; // 商品类型
  name: string; // 商品名称
  goods_category: any; // 商品分类(实际每次返回的是个数组)
  categoryList: Array<any>; // 商品分类数据
  goods_norms: number | string; // 规格名称
  normsList: Array<any>; // 规格名称下拉
  goods_sku: Array<any>; // 规格列表
  isModalVisible: boolean; // 设置规格弹框
  editNormsIndex: number; // 当前要编辑的规格下标
  goods_tag: any; // 商品标签
  previewVisible: boolean; // 添加类目弹框
  nameModalVisible: boolean; // 添加规格名称弹框
  one_sku: number | string; // 单规格显示 1：显示售价 2：显示折扣价
  more_sku: number | string; // 多规格显示 1：区间显示 2：显示最低价
  humbnail_img: Array<any>; // 商品缩略图
  detail_img: Array<any>; // 商品详情图
  hunbanailImgIndex: number; // 记录商品缩略图上传的下标
  detailImgIndex: number; // 记录商品详情图上传的下标
  video: string; // 商品视频
  detail: string; // 商品详情
  freight_price: string | number; // 邮费
  treeData: Array<any>; // 地区
  delivery_area: Array<any>; // 配送地区
  labelList: Array<any>; // 商品标签下拉
  label_ids: Array<any>; // 商品标签
  status: string | number; // 商品状态
  anchor_ids: string | number; // 主播id
  allAnchorList: Array<any>; // 主播列表
  loading: boolean; // loading
  isEdit: boolean; // 是否为编辑
}
export default class List extends Component<any, any> {
  normsFormRef = React.createRef<FormInstance>();
  addNameFormRef = React.createRef<FormInstance>();
  bigForm = React.createRef<FormInstance>();
  constructor(props: any) {
    super(props);
    this.state = this.init();
    this.changeGoodsType = this.changeGoodsType.bind(this);
    this.getGoodsNameNode = this.getGoodsNameNode.bind(this);
    this.getGoodsCategoryNode = this.getGoodsCategoryNode.bind(this);
    this.transformData = this.transformData.bind(this);
    this.getGoodsCategoryList = this.getGoodsCategoryList.bind(this);
    this.getGoodsNormsNode = this.getGoodsNormsNode.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getGoodsNormsList = this.getGoodsNormsList.bind(this);
    this.getGoodsNormsListNode = this.getGoodsNormsListNode.bind(this);
    this.options = this.options.bind(this);
    this.addNormsFn = this.addNormsFn.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.showImg = this.showImg.bind(this);
    this.handleClassCancel = this.handleClassCancel.bind(this);
    this.showClassFn = this.showClassFn.bind(this);
    this.addNameHandleOkFn = this.addNameHandleOkFn.bind(this);
    this.closeNameHandleCancelFn = this.closeNameHandleCancelFn.bind(this);
    this.getAddNormsNode = this.getAddNormsNode.bind(this);
    this.addNameFn = this.addNameFn.bind(this);
    this.addHumbnailImgFn = this.addHumbnailImgFn.bind(this);
    this.addDetailImgFn = this.addDetailImgFn.bind(this);
    this.uploadImgSucFn = this.uploadImgSucFn.bind(this);
    this.uploadImgDetailSucFn = this.uploadImgDetailSucFn.bind(this);
    this.saveImgIndex = this.saveImgIndex.bind(this);
    this.saveDetailImgIndex = this.saveDetailImgIndex.bind(this);
    this.uploadVideo = this.uploadVideo.bind(this);
    this.uploadVideoSrcFn = this.uploadVideoSrcFn.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.delDetailImgFn = this.delDetailImgFn.bind(this);
    this.delImgFn = this.delImgFn.bind(this);
    this.onChangeArea = this.onChangeArea.bind(this);
    this.changeStructure = this.changeStructure.bind(this);
    this.getLabelListFn = this.getLabelListFn.bind(this);
    this.getGoodsLabelNode = this.getGoodsLabelNode.bind(this);
    this.saveFn = this.saveFn.bind(this);
    this.closeFn = this.closeFn.bind(this);
    this.getDetail = this.getDetail.bind(this);
    this.delGoodsSku = this.delGoodsSku.bind(this);
    this.getAnchorList = this.getAnchorList.bind(this);
    this.getGoodsAnchorNode = this.getGoodsAnchorNode.bind(this);
  }
  componentDidMount() {
    this.getGoodsCategoryList();
    this.getGoodsNormsList();
    this.getAreaList();
    this.getLabelListFn();
    this.getAnchorList();
    if (this.props.location.query.id) {
      this.setState({
        isEdit: true
      });
      this.getDetail();
    } else {
      this.setState({
        isEdit: false
      });
    }
    console.log(this.props.location.query.id, 'id');
    // setTimeout(() => {
    //   this.bigForm.current.setFieldsValue({'detail': '<p>qeqwe</p>'});
    //   this.bigForm.current.setFieldsValue({'more_sku': 2});
    // }, 2000);
  }
  // 初始化数值
  init (): FormData {
    const initiate = {
      // goods_type: GoodsType.substance,
      name: '',
      goods_category: '',
      categoryList: [],
      goods_norms: '',
      normsList: [],
      goods_sku: [],
      isModalVisible: false,
      editNormsIndex: 0,
      previewVisible: false,
      nameModalVisible: false,
      one_sku: 1,
      more_sku: 1,
      humbnail_img: [''],
      detail_img: [''],
      hunbanailImgIndex: 0,
      detailImgIndex: 0,
      video: '',
      detail: '',
      freight_price: 0,
      treeData: [],
      delivery_area: [],
      labelList: [],
      anchor_ids: '',
      allAnchorList: [],
      status: 1,
      label_ids: [],
      loading: false,
      isEdit: false,
    };
    setTimeout(() => {
      this.bigForm.current.setFieldsValue(initiate);
    }, 100);
    return initiate as FormData;
  }
  async getDetail(): Promise<void> {
    const data = await goodsDetial(this.props.location.query.id);
    const initiate = {
      name: data.name,
      goods_sku: [],
      goods_category: [],
      label_ids: [],
      humbnail_img: data.humbnail_img,
      detail_img: data.detail_img,
      video: data.video,
      one_sku: data.one_sku,
      more_sku: data.more_sku,
      delivery_area: data.delivery_area,
      freight_price: data.freight_price / 100,
      status: data.status,
      detail: data.detail,
      anchor_id: data.anchor_id
    };
    // 商品标签
    data.label_ids.map(item => {
      initiate.label_ids.push(Number(item));
    });
    // 对商品规格添加uid
    data.goods_sku.map(item => {
      item['uid'] = Math.random();
      item.original_price = item.original_price / 100;
      item.cost_price = item.cost_price / 100;
      item.selling_price = item.selling_price / 100;
      item.studio_price = item.studio_price / 100;
      initiate.goods_sku.push(item);
    });
    // 商品类目
    if (data.goods_category_pid === 0) {
      initiate.goods_category = [data.goods_category];
    } else {
      initiate.goods_category = [data.goods_category_pid, data.goods_category];
    }
    this.setState({
      ...initiate
    });
    setTimeout(() => {
      this.bigForm.current.setFieldsValue(initiate);
    }, 150);
  }
  changeGoodsType(type: number) {
    this.setState({
      goods_type: type,
    });
  }
  // 主播列表
  async getAnchorList(): Promise<void> {
    try {
      const data = await anchorList();
      this.setState({
        allAnchorList: data
      });
      console.log(data, 'zhubo');
    } catch (error) {
      message.error('接口报错');
    }
  }
  // 商品标签列表
  async getLabelListFn(): Promise<void> {
    try {
      const data = await goodsLabel();
      this.setState({
        labelList: data
      });
    } catch (error) {
      message.error('接口报错');
    }
  }
  // 商品名称
  getGoodsNameNode (): React.ReactNode {
    const key = 'name';
    const maxLength = 20;
    // 从缓存的数据中获取名称
    const value = this.state[key] || '';
    const suffix = (<span className="font-gray">{_.size(value)}/{maxLength}</span>);
    return (<div className="w350">
      <Form.Item name={ key } label="商品名称：" rules={[{ required: true, message: '请输入商品名称' }]}>
        <Input className="wmax" placeholder="请输入商品名称" maxLength={maxLength} suffix={ suffix }/>
      </Form.Item>
    </div>);
  }
  // 获取商品分类
  async getGoodsCategoryList(): Promise<void> {
    const data = await goodsCategoryList();
    this.setState({categoryList: [].concat(data)});
  }
  // 商品分类
  getGoodsCategoryNode (): React.ReactNode {
    return (<div className="flex">
      <div className="w350">
        <Form.Item name="goods_category" label="商品分类：" rules={[{ required: true, message: '请选择商品分类'  }]}>
          <Cascader options={this.state.categoryList}
            fieldNames={{value: 'id', label: 'name', children: 'child'}}
            className="wmax" placeholder="请选择商品分类"></Cascader>
        </Form.Item>
      </div>
      <div>
        <div className="ml20">
          <Button type="primary" onClick={ this.showClassFn }>添加分类</Button>
        </div>

        {this.getAddClassNode()}
      </div>
    </div>);
  }
  // 类目
  getAddClassNode(): React.ReactNode {
    const state = this.state;
    return (
      <Modal title="添加类目" visible={state.previewVisible} onCancel={this.handleClassCancel} footer={[<Button key="back" onClick={this.handleClassCancel}>关闭</Button>]}>
        {/* <AddClass categoryList={state.categoryList} getComponentRef={this.getComponentRef}></AddClass> */}
        <AddClass></AddClass>
      </Modal>
    );
  }
  // 显示类目弹框
  showClassFn() {
    this.setState({ previewVisible: true });
  }
  // 取消类目的添加
  handleClassCancel() {
    this.getGoodsCategoryList();
    this.setState({ previewVisible: false });
  }
  // 商品标签
  getGoodsLabelNode (): React.ReactNode {
    return (
      <div className="w350">
        <Form.Item name="label_ids" label="商品标签：" rules={[{ required: true, message: '请选择商品标签', type: 'array' }]}>
          <Select mode="multiple" value={this.state.label_ids} placeholder="请选择商品标签" onChange={this.handleChange}>
            {this.state.labelList.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.label_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    );
  }
  // 规格名称
  getGoodsNormsNode (): React.ReactNode {
    return (<div className="flex">
      <div className="w350">
        <Form.Item name="goods_norms" label="规格名称：" rules={[{ required: false }]}>
          <Select value={this.state.goods_norms} placeholder="请选择商品规格" onChange={this.handleChange}>
            {this.state.normsList.map((item) => (
              <Select.Option key={item.spec_id} value={item.spec_id}>
                {item.spec_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <div>
        <div className="ml20">
          <Button type="primary" onClick={this.addNameFn}>添加规格名称</Button>
        </div>
        {this.getAddNormsNode()}
      </div>
    </div>);
  }
  addNameFn() {
    this.setState({nameModalVisible: true});
  }
  // 添加规格名称
  getAddNormsNode(): React.ReactNode {
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const state = this.state;
    // if (state.categoryList && state.categoryList.length) {
    return (
      <Modal title="添加规格名称" visible={state.nameModalVisible} onOk={this.addNameHandleOkFn} onCancel={this.closeNameHandleCancelFn}>
        <Form {...layout} ref={this.addNameFormRef}  name="size">
          <Form.Item label="规格名称" name="spec_name" rules={[{ required: true }]} >
            <Input  autoComplete="off"/>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
  async addNameHandleOkFn(): Promise<void> {
    const form = this.addNameFormRef.current;
    form.validateFields().then( async (values) => {
      try {
        await goodsSpecAdd(values);
        message.success("添加成功");
        this.setState({
          nameModalVisible: false
        });
        this.getGoodsNormsList();
      } catch (error) {
        message.error('添加失败');
      }
    });
  }
  closeNameHandleCancelFn() {
    const form = this.addNameFormRef.current;
    // 使用 getFieldsValue 获取多个字段值
    // form.validateFields().then(values => {});
    form.resetFields();
    this.setState({nameModalVisible: false});
  }
  getGoodsNormsListNode (): React.ReactNode {
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => this.addNormsFn('')}>添加规格</Button>
        <Table dataSource={this.state.goods_sku} rowKey="uid"  pagination={ false } className="mt20">
          <Table.Column title="规格名称" dataIndex="name" key="name"></Table.Column>
          <Table.Column title="成本价" dataIndex="cost_price" key="cost_price" width={150}></Table.Column>
          <Table.Column title="原价" dataIndex="original_price" key="original_price" width={150}></Table.Column>
          <Table.Column title="售价" dataIndex="selling_price" key="selling_price" width={150}></Table.Column>
          <Table.Column title="直播间最低价" dataIndex="studio_price" key="studio_price" width={150} ></Table.Column>
          <Table.Column title="库存" dataIndex="stock" key="stock" width={150}></Table.Column>
          <Table.Column title="同一ID限购数" dataIndex="limit_num" key="limit_num" width={150}></Table.Column>
          <Table.Column title="规格图" dataIndex="image" key="image" render={this.showImg} width={180}></Table.Column>
          <Table.Column title="操作" dataIndex="" key="" render={this.options} fixed="right" width={250}></Table.Column>
        </Table>
        {/* 添加库存弹框 */}
        <Modal title="设置规格" visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form {...layout} ref={this.normsFormRef}  name="size">
            <Form.Item label="规格名称" name="name" rules={[{ required: true }]} >
              <Input  autoComplete="off"/>
            </Form.Item>
            <Form.Item label="成本价" name="cost_price" rules={[{ required: true }]} >
              <InputNumber min={0} style={{width: '100%'}} autoComplete="off"/>
            </Form.Item>
            <Form.Item label="原价" name="original_price" rules={[{ required: true }]}>
              <InputNumber min={0} style={{width: '100%'}}  autoComplete="off"/>
            </Form.Item>
            <Form.Item label="售卖价" name="selling_price" rules={[{ required: true }]}>
              <InputNumber min={0} style={{width: '100%'}}  autoComplete="off"/>
            </Form.Item>
            <Form.Item label="直播间最低价" name="studio_price" rules={[{ required: true }]}>
              <InputNumber min={0} style={{width: '100%'}}  autoComplete="off"/>
            </Form.Item>
            <Form.Item label="限购数" name="limit_num" rules={[{ required: true }]}>
              <InputNumber min={0} style={{width: '100%'}}  autoComplete="off"/>
            </Form.Item>
            <Form.Item label="库存" name="stock" rules={[{ required: true }]}>
              <InputNumber min={0} style={{width: '100%'}}  autoComplete="off"/>
            </Form.Item>
            <Form.Item label="规格图" name="image" rules={[{ required: true }]}>
              <Upload accept="image/*" remove={false} data={ {type: 'goods'} }></Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
  // 删除规格
  delGoodsSku(index) {
    const newList = JSON.parse(JSON.stringify(this.state.goods_sku));
    newList.splice(index, 1);
    console.log(index, newList, 'aaa');
    this.setState({
      goods_sku: newList
    });
  }
  // 显示图片
  private showImg (text,record,index): React.ReactNode {
    if (record.image) {
      return (
        <img className="normsImg" src={record.image} alt=""/>
      );
    }
  }
  // 库存弹框
  addNormsFn(index?: any, record?: any) {
    // 编辑
    if (index !== '' && record) {
      this.setState({
        isModalVisible: true,
        editNormsIndex: index
      });
      setTimeout(() => {
        this.normsFormRef.current.setFieldsValue(record);
      }, 50);
    } else {
      // 新建
      if (this.state.goods_norms) {
        this.setState({
          isModalVisible: true,
          editNormsIndex: index
        });
      } else {
        message.warning('请先选择规格名称');
      }
    }
  }
  // 确定库存设置
  handleOk() {
    // 获取form内容
    const form = this.normsFormRef.current;
    // 使用 getFieldsValue 获取多个字段值
    form.validateFields().then(values => {
      if (values.original_price < values.selling_price) {
        message.warning('原价要大于售卖价');
        return;
      }
      const addObj = values;
      addObj['spec_id'] = this.state.goods_norms;
      if (this.state.editNormsIndex === '') { // 添加
        addObj.uid = Math.random();
        this.setState({
          goods_sku: this.state.goods_sku.concat(addObj)
        });
      } else {
        const newList = JSON.parse(JSON.stringify(this.state.goods_sku));
        this.setState({
          goods_sku: []
        });
        if (newList[this.state.editNormsIndex]['id']) {
          addObj['id'] = newList[this.state.editNormsIndex]['id'];
        }
        if (newList[this.state.editNormsIndex]['goods_id']) {
          addObj['goods_id'] = newList[this.state.editNormsIndex]['goods_id'];
        }
        addObj['spec_id'] = newList[this.state.editNormsIndex]['spec_id'];
        newList[this.state.editNormsIndex] = addObj;
        newList.map(item => {
          item.uid = Math.random();
        });
        this.setState({
          goods_sku: newList
        });
      }
      form.resetFields();
      this.setState({
        isModalVisible: false
      });
    });
  }
  // 取消库存设置
  handleCancel() {
    const form = this.normsFormRef.current;
    form.resetFields();
    this.setState({
      isModalVisible: false
    });
  }
  // 操作
  private options(text,record,index): React.ReactNode {
    return (
      <div className="flex flex-aic">
        <p className="pointer" onClick={() => this.addNormsFn(index, record)}>编辑</p>
        <p className="pointer ml15" onClick={ () => this.delGoodsSku(index) }>删除</p>
      </div>
    );
  }
  // 规格切换
  handleChange(goods_norms): void {
    this.setState({ goods_norms });
  }
  // 规格下拉
  async getGoodsNormsList() {
    const res = await goodsSpec();
    const normsList = _.each(res, item => {
      return { spec_id: item.spec_id, spec_name: item.spec_name};
    });
    this.setState({
      normsList: [].concat(normsList)
    });
  }
  // 数据转换
  transformData(data) {
    const state = Object.assign({}, this.state);
    // 缓存数据
    _.each(data, (value: any, key: string) => {
      // 兼容数组的数据更新
      safeSet(state, key, value);
    });
    return state;
  }
  // 添加商品缩略图
  addHumbnailImgFn() {
    let flag = false;
    this.state.humbnail_img.map(item => {
      if (!item) {
        flag = true;
      }
    });
    if (flag) {
      message.warning('请将空白的上传后再添加');
      return;
    }
    const humbnail_img = [].concat(this.state.humbnail_img, '');
    this.setState({ humbnail_img });
  }
  addDetailImgFn() {
    let flag = false;
    this.state.detail_img.map(item => {
      if (!item) {
        flag = true;
      }
    });
    if (flag) {
      message.warning('请将空白的上传后再添加');
      return;
    }
    const detail_img = [].concat(this.state.detail_img, '');
    this.setState({ detail_img });
  }
  // 删除商品缩略图
  delDetailImgFn() {
    const detail_img = this.state.detail_img;
    detail_img.splice(this.state.detailImgIndex, 1);
    this.setState({
      detail_img
    });
  }
  delImgFn() {
    const humbnail_img = this.state.humbnail_img;
    humbnail_img.splice(this.state.hunbanailImgIndex, 1);
    this.setState({
      humbnail_img
    });
  }
  // 上传成功
  uploadImgSucFn(src) {
    const newList = this.state.humbnail_img;
    newList[this.state.hunbanailImgIndex] = src;
    this.setState({
      humbnail_img: newList
    });
  }
  uploadImgDetailSucFn(src) {
    const newList = this.state.detail_img;
    newList[this.state.detailImgIndex] = src;
    this.setState({
      detail_img: newList
    });
  }
  // 记录图片上传的index
  saveImgIndex(index) {
    this.setState({
      hunbanailImgIndex: index
    });
  }
  saveDetailImgIndex(index) {
    this.setState({
      detailImgIndex: index
    });
  }

  // 上传视频
  uploadVideo(): React.ReactNode {
    const state = this.state;
    if (state.video) {
      return (
        <div className="video-container upload-box">
          <video src={ state.video } controls className="wid-104-video"></video>
          <DeleteTwoTone className="upload-remove font-18" onClick={ this.onRemove }></DeleteTwoTone>
        </div>
        
      );
    } else {
      return (
        <Upload remove={false} data={ {type: 'goods'} } value={''} onChange={ this.uploadVideoSrcFn }></Upload>
      );
    }
  }
  uploadVideoSrcFn(src) {
    this.setState({
      video: src
    });
  }
  onRemove() {
    this.setState({
      video: ''
    });
  }
  // 获取地址
  async getAreaList(): Promise<void> {
    try {
      const data = await getArea();
      const newList = this.changeStructure(data);
      this.setState({
        treeData: newList
      });
    } catch (error) {
      message.error('接口报错');
    }
  }
  // 改变结构
  changeStructure(data) {
    const item = [];
    data.map((list, i) => {
      const newData = {};
      newData['key'] = list.area_code;
      newData['value'] = list.area_code;
      newData['title'] = list.area_name;
      if (list.children && list.children.length > 0) {
        newData['children'] = this.changeStructure(list.children);
      }
      item.push(newData);
    });
    return item;
  }
  // 改变区域
  onChangeArea(val,label, extra) {
    const db = new DB([], 'id', 'pid');
    db.insert(db.flatten(this.state.treeData, 'children'));
    const list = db.parentDeepFlatten({value: val});
    console.log(list);
  }
  // 主播列表
  getGoodsAnchorNode (): React.ReactNode {
    return (
      <div>
        <Form.Item className="w550" name="anchor_id" label="以下主播可添加该商品（限一个主播）：" rules={[{ required: false, message: '请选择主播' }]}>
          <Select value={this.state.anchor_id} placeholder="请选择主播">
            {this.state.allAnchorList.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    );
  }
  // 保存
  saveFn() {
    console.log(this.state.humbnail_img, this.state.detail_img, this.state.video);
    console.log(this.state.goods_sku);
    if (this.state.goods_sku.length <= 0) {
      message.warning('请添加规格');
      return;
    }
    if (!this.state.video) {
      message.warning('请上传视频介绍');
      return;
    }
    const humbnail_img = [];
    this.state.humbnail_img.map(item => {
      if (item) {
        const src = item.split('.com')[1];
        humbnail_img.push(src);
      }
    });
    if (humbnail_img.length <= 0) {
      message.warning('请上传商品缩略图');
      return;
    }
    const detail_img = [];
    this.state.detail_img.map(item => {
      if (item) {
        const src = item.split('.com')[1];
        detail_img.push(src);
      }
    });
    if (detail_img.length <= 0) {
      message.warning('请上传商品轮播图');
      return;
    }
    // 商品规格列表
    const goods_sku = [];
    this.state.goods_sku.map(item => {
      if (item.id) {
        goods_sku.push({
          name: item.name,
          stock: item.stock,
          original_price: item.original_price * 100,
          cost_price: item.cost_price * 100,
          selling_price: item.selling_price * 100,
          image: item.image.split('.com')[1],
          limit_num: item.limit_num,
          spec_id: item.spec_id,
          studio_price: item.studio_price * 100,
          id: item.id
        });
      } else {
        goods_sku.push({
          name: item.name,
          stock: item.stock,
          original_price: item.original_price * 100,
          cost_price: item.cost_price * 100,
          selling_price: item.selling_price * 100,
          image: item.image.split('.com')[1],
          limit_num: item.limit_num,
          spec_id: item.spec_id,
          studio_price: item.studio_price * 100
        });
      }
      
    });
    this.setState({
      loading: false
    });
    const form = this.bigForm.current;
    form.validateFields().then( async (values) => {
      try {
        const query = values;
        // 规格
        query['goods_sku'] = JSON.stringify(goods_sku);
        // 配送地域
        const goods_delivery_area = [];
        if (this.state.delivery_area.length >= 1) {
          this.state.delivery_area.map(item => {
            const db = new DB([], 'id', 'pid');
            db.insert(db.flatten(this.state.treeData, 'children'));
            const list = db.parentDeepFlatten({value: item});
            console.log(list);
            goods_delivery_area.push({
              province_code: list[0] ? list[0]['value'] : 0,
              city_code: list[1] ? list[1]['value'] : 0,
              area_code: list[2] ? list[2]['value'] : 0
            });
          });
        }
        // 地址
        query['goods_delivery_area'] = JSON.stringify(goods_delivery_area);
        query['delivery_area'] = JSON.stringify(this.state.delivery_area);
        // 商品类目
        if (this.state.goods_category.length === 1) {
          query['goods_category_pid'] = 0;
          query['goods_category'] = this.state.goods_category[0];
        } else {
          query['goods_category_pid'] = this.state.goods_category[0];
          query['goods_category'] = this.state.goods_category[1];
        }
        // 图片和视频
        query['humbnail_img'] = humbnail_img.join(',');
        query['detail_img'] = detail_img.join(',');
        query['video'] = this.state.video.split('.com')[1];

        query['label_ids'] = JSON.stringify(this.state.label_ids);
        query['freight_price'] = this.state.freight_price * 100;
        this.setState({
          loading: true
        });
        console.log(query, 'sss');
        if (this.state.isEdit) {
          query['id'] = this.props.location.query.id;
          await goodsEdit(query);
          message.success("编辑成功");
        } else {
          await goodsAdd(query);
          message.success("添加成功");
        }
        
        
        browserHistory.goBack();
      } catch (error) {
        console.log(error);
        this.setState({
          loading: false
        });
        message.error('添加失败');
      }
    });
    console.log('save');
  }
  // 取消
  closeFn() {
    browserHistory.goBack();
  }
  render () {
    const onFinish = (values: any) => {
      console.log(values);
    };
    const onFinishFailed = (values: any) => {
      console.log(values);
    };
    // form表单修改
    const onChangeValues = (data: FormData): void => {
      console.log('form表单修改的值：', data);
      const state = this.transformData(data);
      this.setState(state);
    };
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    const tProps = {
      treeData: this.state.treeData,
      value: this.state.delivery_area,
      onChange: this.onChangeArea,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      placeholder: '请选择可配送的区域',
      style: {
        width: '100%',
      },
    };
    return (
      <div>
        <div className="title-goods mb20">编辑基础信息</div>
        <Form
          name="basic"
          ref={this.bigForm}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onChangeValues}
        >
          {/* <Form.Item
            label="商品信息："
            name="goods_type"
          >
            <div className="flex">
              <div className={this.state.goods_type === 1 ? "default-box active-box" : "default-box"} onClick={() => this.changeGoodsType(1)}>
                <p className="big-tip">实物商品</p>
                <p className="small-tip">（物流发货）</p>
                <img src={checked} className={this.state.goods_type === 1 ? "active-img" : "none"} alt=""/>
              </div>
              <div className={this.state.goods_type === 2 ? "default-box active-box ml15" : "default-box ml15"} onClick={() => this.changeGoodsType(2)}>
                <p className="big-tip">虚拟商品</p>
                <p className="small-tip">（无需物流）</p>
                <img src={checked} className={this.state.goods_type === 2 ? "active-img" : "none"} alt=""/>
              </div>
            </div>
          </Form.Item> */}


          {/* 商品名称 */}
          {this.getGoodsNameNode()}
          {/* 商品分类 */}
          {this.getGoodsCategoryNode()}
          {/* 商品标签 */}
          {this.getGoodsLabelNode()}
          <div className="title-goods mb20">商品规格</div>
          {/* 商品规格 */}
          {this.getGoodsNormsNode()}
          {/* 商品规格列表 */}
          {this.getGoodsNormsListNode()}
          <div className="title-goods mt20 mb10">单一规格时价格显示</div>
          <Form.Item
            label=""
            name="one_sku"
          >
            <Radio.Group>
              <Radio value={1} style={radioStyle}>一口价（只显示售价）</Radio>
              <Radio value={2} style={radioStyle}>折扣价（显示原价和售价)</Radio>
            </Radio.Group>
          </Form.Item>

          <div className="title-goods mt20 mb10">多规格时价格显示</div>
          <Form.Item
            label=""
            name="more_sku"
          >
            <Radio.Group>
              <Radio value={1} style={radioStyle}>价格区间（最低价格-最高价格）</Radio>
              <Radio value={2} style={radioStyle}>显示最低价格</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="商品缩略图："
          >
            <div className="flex flex-aic">
              {this.state.humbnail_img.map( (item, index) => {
                return (
                  <Upload key={index} remove={this.state.humbnail_img.length > 1 ? true : false} data={ {type: 'goods'} } value={item} onChange={this.uploadImgSucFn} onClick={() => this.saveImgIndex(index)} onRemove={ this.delImgFn }></Upload>
                );
              })}
              <Button onClick={ this.addHumbnailImgFn }>添加商品缩略图</Button>
            </div>
          </Form.Item>
          <Form.Item
            label="商品轮播图："
          >
            <div className="flex flex-aic">
              {this.state.detail_img.map( (item, index) => {
                return (
                  <Upload key={index} remove={this.state.detail_img.length > 1 ? true : false} data={ {type: 'goods'} } value={item} onChange={this.uploadImgDetailSucFn} onClick={() => this.saveDetailImgIndex(index)} onRemove={ this.delDetailImgFn }></Upload>
                );
              })}
              <Button onClick={ this.addDetailImgFn }>添加商品轮播图</Button>
            </div>
          </Form.Item>
          <Form.Item
            label="商品视频介绍："
          >
            <div>
              {this.uploadVideo()}
            </div>
          </Form.Item>
          <Form.Item name="detail" label="商品详情：" rules={[{ required: true, message: '请输入商品详情' }]}>
            <Editor></Editor>
          </Form.Item>
          
          <div className="title-goods mt20 mb10">物流配置</div>
          <Form.Item name="freight_price" label="统一邮费：" rules={[{ required: true, message: '请输入邮费'}]}>
            <InputNumber min={0}></InputNumber> 
          </Form.Item>
          <Form.Item name="delivery_area" label="不可配送地区：" rules={[{ required: false, message: '请选择可配送地区' }]}>
            <TreeSelect {...tProps} style={{width: '350px'}} />
          </Form.Item>

          <div className="title-goods mt20 mb10">商品添加限制</div>
          {/* 主播 */}
          {this.getGoodsAnchorNode()}

          <div className="title-goods mt20 mb10">上下架</div>
          <Form.Item
            label=""
            name="status"
          >
            <Radio.Group>
              <Radio value={1} style={radioStyle}>立即上架</Radio>
              <Radio value={2} style={radioStyle}>暂不上架</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
        <Button type="primary" style={{width: '130px'}} onClick={this.saveFn} loading={this.state.loading} >保存</Button>
        <Button style={{width: '130px'}} className="ml20" onClick={this.closeFn}>取消</Button>
      </div>
    );
  }
}