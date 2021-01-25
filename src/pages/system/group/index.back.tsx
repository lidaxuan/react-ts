/*
 * @Author: MrZhang
 * @Date: 2021-01-05 09:49:18
 * @Description: 直播列表页
 */

import React, { Component } from 'react';
import { Link } from 'react-router';
import * as config from 'src/routers/config';
import { Form, Input, Button, Select, Space, Table, Pagination, message, Radio } from 'antd';
import { CopyOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import 'src/styles/goods/goods.scss';
import * as Loading from 'src/utils/decorators/loading';
import Upload from 'src/components/upload/index';
import { FormInstance } from 'antd/lib/form';



// 注入 Loading
@Loading.Class()
export default class Demo1 extends Component<any, any> {
  formRef = React.createRef<FormInstance>();
  constructor(props: any) {
    // 执行父类构造方法
    super(props);
    this.state = {
      dataSource: [],
      mode: 'tenant',
      capo: 'gvbhjnkml;dgfhjbk',
      detail_img: [''],
    };
    this.tenant = this.tenant.bind(this);
    this.share = this.share.bind(this);
    this.afterSale = this.afterSale.bind(this);
  }

  layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 5 },
  };
  tailLayout = {
    wrapperCol: { offset: 2, span: 5 },
  };
  //切换~
  liveChange = e => {
    const mode = e.target.value;
    this.setState({ mode });
  };
  //商户信息模块
  private tenant(): React.ReactNode {

    return (
      <div className="mt20">
        <Form {...this.layout} ref={this.formRef}>
          <Form.Item label="商户名称">
            <Input></Input>
          </Form.Item>
          <Form.Item name="logo" label="商户logo">
            <Upload accept="image/*"></Upload>
          </Form.Item>
          <Form.Item {...this.tailLayout}>
            <Button type="primary" shape="round" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
  //一键复制功能
  copyAccessKey = () => {
    console.log();
  }

  //分享信息模块
  private share(): React.ReactNode {
    return (
      <div className="mt20">
        <Form {...this.layout}>
          <Form.Item label="小程序地址">
            <div className="dfx">
              <div><Input></Input></div>
              <div><Button type="primary" icon={<CopyOutlined />} onClick={this.copyAccessKey} /></div>
            </div>
          </Form.Item>
          <Form.Item label="小程序二维码">
            <div className="dfx">
              <div className="goodsImg"></div>
              <div className="ml20 mt30"><Button type="primary" icon={<VerticalAlignBottomOutlined />} size="small" /></div>
            </div>
          </Form.Item>
          <Form.Item {...this.tailLayout}>
            <Button type="primary" shape="round">保存</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
  onFinish = (values: any) => {
    console.log('Success:', values);
  };

  onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  //售后设置模块
  private afterSale(): React.ReactNode {
    return (
      <div className="mt20">
        <Form {...this.layout} initialValues={{ ['way']: 'weChat' }} onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
          <Form.Item label="退货地址" name="adress" rules={[{ required: true, message: '请输入退货地址' }]}>
            <Input autoComplete="off"></Input>
          </Form.Item>
          <Form.Item label="收货人姓名" name="username" rules={[{ required: true, message: '请输入收货人姓名' }]}>
            <Input autoComplete="off"></Input>
          </Form.Item>
          <Form.Item label="收货人手机号" name="phoneNum" rules={[{ required: true, message: '请输入收货人手机号' }]}>
            <Input autoComplete="off"></Input>
          </Form.Item>
          <Form.Item label="客服方式" name="way" rules={[{ required: true, message: '请选择客服方式' }]}>
            <Radio.Group>
              <Radio value="weChat">微信</Radio>
              <Radio value="phone">手机号</Radio>
            </Radio.Group>
          </Form.Item>
          {

          }
          <Form.Item {...this.tailLayout}>
            <Button type="primary" shape="round" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  render(): React.ReactElement {
    const { mode } = this.state;
    return (
      <div>
        <div className="line">商户设置</div>
        <div>
          <Radio.Group onChange={this.liveChange} buttonStyle="solid" value={mode}>
            <Radio.Button value="group">商户信息</Radio.Button>
            <Radio.Button value="share">分享信息</Radio.Button>
            <Radio.Button value="service">售后设置</Radio.Button>
          </Radio.Group>
        </div>
        <div>
          {mode === "tenant" ? this.tenant() : (mode === "share" ? this.share() : this.afterSale())}
        </div>
      </div>);
  }
}

