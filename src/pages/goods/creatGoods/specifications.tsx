  
import React, { Component, useState } from 'react';
import { Form, Input, Button, Checkbox, Select, Table, Modal, message } from 'antd';
import { CategoryOpt }  from '../common/interface';
// /父组件
import { Parmas } from 'src/utils/interface';
import { goodsSpec, goodsSpecAdd } from 'src/model/goods/goods';
import _ from 'lodash';
import 'src/styles/goods/create.scss';
import { FormInstance } from 'antd/lib/form';
// import uuid from 'uuid';
export const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

export const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
export default class Specifications extends Component<any, any> {
  formRef = React.createRef<FormInstance>();
  constructor(props: any) {
    super(props);
    this.state = {
      tableList: [], // 表格数据
      categoryOpt: [],
      selectedItem: '',
      nameModalVisible: false,
      sizeModalVisible: false,
      sizeKey: '',
    };
    this.getGoodsSpec = this.getGoodsSpec.bind(this);
    this.getCategoryView = this.getCategoryView.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addNmaeHandle = this.addNmaeHandle.bind(this);
    this.onFinish = this.onFinish.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.sizeModelFinish = this.sizeModelFinish.bind(this);
  }

  componentDidMount () {
    this.getGoodsSpec.bind(this);
    this.props.getComponentRef('category', this.state.tableList);
    this.setState({
      tableList: [].concat(this.props.goods_sku)
    });
    this.getGoodsSpec();
  }
  componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
  }
  // 设置state
  setInitState() {
    const state = {
      tableList: [],
      categoryOpt: [],
      selectedItem: []
    };
    return state as Parmas;
  }
  // 获取规格列表
  async getGoodsSpec() {
    const res = await goodsSpec();
    const data = _.each(res, item => {
      return { spec_id: item.spec_id, spec_name: item.spec_name};
    });
    this.setState({
      categoryOpt: data
    });
  }
  // 获取规格视图
  getCategoryView(): React.ReactNode {
    const { selectedItem, categoryOpt } = this.state;
    return (
      <div>
        <Select value={selectedItem} onChange={this.handleChange} style={{ width: 150 }}>
          {categoryOpt.map((item) => (
            <Select.Option key={item.spec_id} value={item.spec_id}>
              {item.spec_name}
            </Select.Option>
          ))}
        </Select>
      </div>
    );
  }
  // 规格Change
  handleChange(selectedItem) {
    this.setState({ selectedItem });
  }
  
  // 
  addNmaeHandle (flag) {
    this.setState({
      nameModalVisible: flag
    });
  }
  addSizeHandle (flag) {
    this.setState({
      sizeModalVisible: flag
    });
    this.setState({
      sizeKey: Math.random()
    });
  }
  // 添加规格名称
  async onFinish (spec_name) {
    const {id} = await goodsSpecAdd(spec_name);
    if (id) {
      this.addNmaeHandle(false);
      this.getGoodsSpec();
      message.success('添加成功');
    }
  }
  // 添加规格值
  sizeModelFinish (val) {
    const list = this.state.tableList;
    val.spec_id = this.state.selectedItem;
    // val.id = Math.random();
    this.setState({
      tableList: [].concat(list, val)
    });
    this.addSizeHandle(false); //关闭
    this.props.getComponentRef('category', this.state.tableList);
  }
  getAddNmaeView():React.ReactNode {
    return (
      <Form {...layout} name="basic" onFinish={this.onFinish}>
        <Form.Item label="规格名称" name="spec_name" rules={[{ required: true, message: '请输入规格名称' }]} >
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">确定</Button>
        </Form.Item>
      </Form>
    );
  }
  // 添加规格值按钮
  handleAdd (value){
    console.log('value: ', value);
    // this.setState({
    //   dataSource: [...this.state.dataSource, value]
    // });
  }
  
  getSizeView():React.ReactNode {
    return (
      <Form key={this.state.sizeKey} {...layout} name="size" onFinish={this.sizeModelFinish}>
        <Form.Item label="规格名称" name="name" rules={[{ required: true, message: 'Please input your username!' }]} >
          <Input />
        </Form.Item>
        <Form.Item label="成本价" name="cost_price" rules={[{ required: true, message: 'Please input your password!' }]} >
          <Input />
        </Form.Item>
        <Form.Item label="原价" name="original_price" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="售价" name="selling_price" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="库存" name="stock" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="实际销量" name="sales" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input />
        </Form.Item>
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
              <Button className="mr20" size="middle" type="primary">编辑</Button>
              <a onClick={() => this.tableDel(record)}>删除</a>
            </div>
          );
        },
      },
    ];
    if (this.state.tableList && this.state.tableList.length) {
      return (
        <Table bordered dataSource={this.state.tableList} columns={columnsItem} pagination={false} rowKey="id" size="small" />
      );
    }
    return void 0;
  }
  render(): React.ReactElement {
    const state = this.state;
    return (
      <div>
        <Form name="name" className="name" initialValues={{ remember: true }}>
          <Form.Item label="规格名称">
            {this.getCategoryView()}
          </Form.Item>
          <Button className="ml20 mr20" type="primary" onClick={() => {this.addNmaeHandle(true);}}>添加规格名称</Button>
          <Button type="primary" onClick={() => {this.addSizeHandle(true);}}>添加规格值</Button>
          
        </Form>
        <Modal title="商品规格名称" visible={state.nameModalVisible} footer={null} onCancel={() => {this.addNmaeHandle(false);}} >
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
      </div>);
  }
}
