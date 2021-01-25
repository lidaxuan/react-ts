/*
 * @Author: MrZhang
 * @Date: 2020-12-27 11:08:34
 * @Description: 订单详情
 */
import _ from 'lodash';
import React, { Component } from 'react';
import { Row, Col, Button, Table, Image, Space, Card, Descriptions, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
import 'src/styles/info.scss';
import EditAddress from './editAddress';
import DeliverGoods from './DeliverGoods';
import { getOrderDtail } from 'src/model/order';
import { Parmas } from 'src/utils/interface';
import Message from 'src/utils/decorators/message';

class State {
  orderDetail: Parmas = {
    address: {},
    order_sub: [],
  }; // 订单信息对象 ajax请求

  a1?: number = 100; // 订单号
  height?: number = 100;
  text?: string;
  statusMap: any = {
    "1": '普通订单',
    "2": '加急订单',
  };

  isConsignee?: boolean = false;
  isDeliver?: boolean = false;
  consigneeForm = {};
}


export default class OrderInfo extends Component<any, State> {
  formRef = React.createRef<FormInstance>();
  constructor(props: any) {
    super(props);
    this.state = new State();
    this.showModal = this.showModal.bind(this);
    this.deliverGoodsBtn = this.deliverGoodsBtn.bind(this);
    this.ConsigneeCancel = this.ConsigneeCancel.bind(this);
    this.DeliverCancel = this.DeliverCancel.bind(this);
    this.getOrderInfo = this.getOrderInfo.bind(this);
  }
  componentDidMount() {
    this.getOrderInfo();
  }
  @Message()
  async getOrderInfo() {
    const { id } = this.props.location.query;
    if (id) {
      const data = await getOrderDtail(id);
      this.setState({ orderDetail: data });
    }
  }
  //去发货按钮
  deliverGoodsBtn() {
    this.setState({ isDeliver: true });
  }
  //去发货取消按钮
  DeliverCancel(): void {
    this.setState({ isDeliver: false });
  }
  // 修改收货人地址显示
  showModal() {
    this.setState({ isConsignee: true });
  }
  // 修改收货人取消按钮
  ConsigneeCancel() {
    this.setState({ isConsignee: false });
  }
  //修改地址弹窗
  private getEditAddress(): React.ReactNode {
    if (this.state.orderDetail) {
      return (
        <EditAddress key={Math.random()} getOrderInfo={this.getOrderInfo} handleConsigneeCancel={this.ConsigneeCancel} form={this.state.orderDetail}>
        </EditAddress>);
    }
    return void 0;
  }
  //去发货弹窗
  private getDeliverGoods(): React.ReactNode {
    if (this.state.consigneeForm) {
      return (
        <DeliverGoods DeliverCancel={this.DeliverCancel} getOrderInfo={this.getOrderInfo} form={this.state.consigneeForm} id={this.props.location.query}></DeliverGoods>
      );
    }
    return void 0;
  }
  //修改地址信息按钮
  private EditAddressMsg() {
    const state: State = this.state;
    const { order_status } = state.orderDetail;
    if (order_status === 2) {
      return (
        <Button type="primary" onClick={this.showModal}>修改</Button>
      );
    } else {
      return (null);
    }

  }
  //商品名称
  private getname(text, record): React.ReactNode {
    return (
      <div className="flex">
        <div><Image className="mr20" width={40} height={40} src={text.goods_sku_image} /></div>
        <div className="m10"><a>{record.goods_name}</a></div>
      </div>
    );
  }
  // 金额
  private getGoodsPrice(price: number): React.ReactNode {
    if (price) {
      return (<span>￥{price / 100}元</span>);
    } else {
      return (<span>￥0元</span>);
    }
  }
  render(): React.ReactElement {
    const state: State = this.state;
    const { order_status, refund_status, address } = state.orderDetail;
    return (
      <div>
        {/* 发货 */}
        <div className="mb20">
          {order_status === 2 ? <Button type="primary" onClick={this.deliverGoodsBtn}>去发货</Button> : null}
        </div>
        {/* 订单信息 */}
        <Row className="mb10">
          <Col span={8}>
            <Card title="订单信息" bordered={true} >
              <div className="mt10">订单号：{state.orderDetail.order_no}</div>
              {/* <div className="mt10">订单类型：{state.orderDetail.order_no}</div> */}
              <div className="mt10">下单时间：{state.orderDetail.created_at}</div>
              <div className="mt10">支付时间：{state.orderDetail.pay_time}</div>
              <div className="mt10">订单金额：{this.getGoodsPrice(state.orderDetail.goods_price)}</div>
              <div className="mt10">实付金额：{this.getGoodsPrice(state.orderDetail.real_price)}</div>
              <div className="mt10">运费：{this.getGoodsPrice(state.orderDetail.freight_price)}</div>
              <div className="mt10">优惠金额：{this.getGoodsPrice(state.orderDetail.discount_price)}</div>
            </Card>
          </Col>
          <Col span={8}>
            <Card className="ml10" title="收货信息" bordered={true} extra={this.EditAddressMsg()}>
              <div className="mt10">收货姓名：{address.name}</div>
              <div className="mt10">收货人联系方式：{address.phone}</div>
              <div className="mt10">
                <span>收货人地址：</span>
                <span>
                  {address.province} {address.city} {address.area} {address.detail}
                </span>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card className="ml10" title="买家信息" bordered={true}>
              <div className="mt10">买家昵称：{state.orderDetail.member_nickname}</div>
              <div className="mt10">买家ID：{state.orderDetail.member_id}</div>
              <div className="mt10">买家手机号：{state.orderDetail.member_phone}</div>
            </Card>
          </Col>
        </Row>
        {/* 商品表格 */}
        <Table dataSource={state.orderDetail.order_sub} rowKey="id" pagination={false}>
          <Table.Column title="商品名称" dataIndex="goods_name" key="goods_name" render={this.getname}></Table.Column>
          <Table.Column title="规格" dataIndex="goods_sku_name" key="goods_sku_name" ></Table.Column>
          <Table.Column title="数量" dataIndex="real_price" key="real_price" ></Table.Column>
          <Table.Column title="订单价格" dataIndex="goods_price" key="goods_price" render={this.getGoodsPrice}></Table.Column>
          <Table.Column title="优惠" dataIndex="discount_price" key="discount_price" render={this.getGoodsPrice}></Table.Column>
          <Table.Column title="实付金额" dataIndex="real_price" key="real_price" render={this.getGoodsPrice}></Table.Column>
        </Table>
        {/* 去发货弹窗 */}
        <Modal title="发货" maskClosable={false} visible={state.isDeliver} footer={null} onCancel={this.DeliverCancel}>
          {this.getDeliverGoods()}
        </Modal>
        {/* 收货人地址修改弹窗 */}
        <Modal title="地址修改" maskClosable={false} visible={state.isConsignee} footer={null} onCancel={this.ConsigneeCancel}>
          {this.getEditAddress()}
        </Modal>

      </div>
    );
  }
}

