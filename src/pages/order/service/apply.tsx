/*
 * @Author: MrZhang
 * @Date: 2021-01-05 09:49:18
 * @Description: 申请详情
 */

import React from 'react';
import ServiceGroup, { Labels } from './common';
import { Form } from 'antd';
import * as serve from 'src/model/order/index';
import _ from 'lodash';


export default class ServiceApply extends ServiceGroup<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      detailsData: {},
      id: null
    };
  }
  formSpaceName = 'SystemGroupInfo'
  // 返回 Radio 默认选中的值
  getRadioValue(): Labels {
    return Labels.apply;
  }
  componentDidMount() {
    const { id } = this.props.location.query;
    this.setState({ id });
    this.getOrderInfo({ order_id: id });
  }

  //数据请求
  async getOrderInfo(value) {
    try {
      const data = await serve.applyDetail(value);
      this.setState({
        detailsData: data
      });
    } catch (error) {
      //todo
    }
  }
  
  getContent(): React.ReactNode {
    const { detailsData } = this.state;
    return (
      <div className="w350 pt20">
        <Form>
          <Form.Item label="申请退款原因" >
            {detailsData.refund_reason}
          </Form.Item>
          <Form.Item label="售后具体描述" >
            {detailsData.refund_remarks}
          </Form.Item>
          <Form.Item label="物品照片" >
            <img className="goodsImg" src={detailsData.refund_image}></img>
          </Form.Item>
          <Form.Item label="退款方式">
            {"原路返回"}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

