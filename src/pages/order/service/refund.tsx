/**
 * @file 退款处理
 */

import React from 'react';
import ServiceGroup, { Labels } from './common';
import { Form, Steps, Button } from 'antd';
import * as serve from 'src/model/order/index';
import _ from 'lodash';
import 'src/styles/goods/goods.scss';
import Info from '../info';


export default class ServiceRefund extends ServiceGroup<any, any> {
  formSpaceName = 'SystemGroupService'
  constructor(props: any) {
    super(props);
    this.state = {
      options: [],
      apll: {
        detail: [],
        express_name: "中天万运",
        express_number: "12345678912",
        state: 0
      },
      status: 0,
    };
    this.refundBut = this.refundBut.bind(this);
  }
  getRadioValue(): Labels {
    return Labels.service;
  }
  componentDidMount() {
    const { id } = this.props.location.query;
    this.setState({ id });
    this.getOrderData({ order_id: id });
    this.logistics({ order_id: id, type: 2 });
  }
  //售后申请详情
  async getOrderData(value) {
    try {
      const data = await serve.applyDetail(value);
      this.setState({ status: data.status, applyid: data.id });
    } catch (error) {
      //todo
    }
  }
  //物流详情
  async logistics(value) {
    try {
      const data = await serve.logistics(value);
      this.setState({
        apll: data
      });
    } catch (error) {
      //todo
    }
  }
  //退款按钮
  async refundBut() {
    try {
      await serve.refundConfirm({ order_id: this.state.applyid });
      this.getOrderData({ order_id: this.state.id });
    } catch (error) {
      //tode
    }
  }
  getContent(): React.ReactNode {
    const { apll, status } = this.state;
    const { detail } = apll;
    return (
      <div className="pt20">
        {/* 物流信息 */}
        <Form>
          <Form.Item label="快递公司" >
            {apll.express_name}
          </Form.Item>
          <Form.Item label="快递单号" >
            {apll.express_number}
          </Form.Item>
          <Form.Item label="物流信息">
            <Steps direction="vertical" progressDot>
              {
                detail.map((item, index) => {
                  return (
                    <Steps.Step title={item.status} key={index} description={item.context} />
                  );
                })
              }
            </Steps>
          </Form.Item>
        </Form>
        {/* 订单详情 */}
        <Info {...this.props}></Info>
        {/* 退款按钮 */}
        <div className="mt20  tar">
          {
            status === 0 || status === 1 ? <Button type="primary" onClick={this.refundBut}>确认退款</Button> : null
          }
        </div>
      </div >);
  }
}

