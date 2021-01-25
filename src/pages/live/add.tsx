
import React from 'react';
import {Form,Input, Button } from 'antd';
import 'src/styles/live.scss';
import * as config from 'src/routers/config';
import { getOrderList } from 'src/model/order';

import * as Search from 'src/utils/decorators/search';
import * as Loading from 'src/utils/decorators/loading';
import Message from 'src/utils/decorators/message';
import { browserHistory } from 'react-router';
interface Query {
  page?: number;
  page_size?: number;
}
@Loading.Class()
export default class LiveAdd extends React.Component<any,any> {
  constructor(props: any) {
    super(props);
    // 设置默认值
    this.state = {
      current: 1,
      tableList: [],
      page: 1,
      page_size: 10,
      total: 0,
      form:{
        order_no: '',
        order_status: 1, 
      }
    };
    this.onFinish = this.onFinish.bind(this);
  }
  componentDidMount () {
    // 默认请求第一页数据
    this.getOrderList({ 
      page: 1
    });
  }
  @Search.debounce() // 该方法在一定时间段内只执行一次
  @Loading.Fun()
  @Message() // 处理接口异常
  async getOrderList(query?: Query) {
    let param = Object.assign({}, {
      page: this.state.page,
      page_size: this.state.page_size
    }, query || {});
    param = Object.assign({}, param ,this.state.form);
    const result = await getOrderList<any>(param);
    const { data = [], total = 1 } = result || {};
    this.setState({
      tableList: [].concat(data),
      total: total,
      page: param.page
    });
  }
  protected onFinish(value){
    this.setState({
      form:{
        order_no: value.order_no,
        order_status: value.order_status,
        pay_channel: value.pay_channel,
        start_date: this.state.form.start_date,
        end_date: this.state.form.end_date,
      }
    });
    this.getOrderList();
    // 回到上一页
    browserHistory.goBack();
  }
  render(): React.ReactElement {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <div className="pd20">
        <p className="addLiveTitle">信息录入</p>
        <Form
          name="basic"
          className="createBox"
          initialValues={this.state.form}
          onFinish={this.onFinish}
          {...layout}
        >
          <Form.Item
            label="主播姓名"
            name="order_no"
          >
            <Input placeholder="请输入主播姓名" className="circleBorder"/>
          </Form.Item>
          <Form.Item
            label="主播昵称"
            name="order_no"
          >
            <Input placeholder="请输入主播昵称" className="circleBorder"/>
          </Form.Item>
          <Form.Item
            label="手机号"
            name="order_no"
          >
            <Input placeholder="请输入手机号" className="circleBorder"/>
          </Form.Item>
          <Form.Item
            label="微信号"
            name="order_no"
          >
            <Input placeholder="请输入微信号" className="circleBorder"/>
          </Form.Item>
          <Form.Item
            label=""
          >
            <Button type="primary" htmlType="submit" shape="round" className="sureBtn">确定</Button>
            <Button htmlType="submit" shape="round" className="cancelBtn">取消</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

