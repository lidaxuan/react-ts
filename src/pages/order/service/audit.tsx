/**
 * @file 审核处理
 */

import React from 'react';
import ServiceGroup, { Labels } from './common';
import { Form, Radio, Modal, Card, Input, Button, Cascader, Checkbox, Table } from 'antd';
import * as serve from 'src/model/order/index';
import 'src/styles/goods/goods.scss';
import _ from 'lodash';





const parm = {
  default_addr: "",
  name: "",
  phone: "",
  province: "",
  province_code: "",
  city: "",
  city_code: "",
  area: "",
  area_code: "",
  detail: "",
};

export default class ServiceAudit extends ServiceGroup<any, any> {
  formSpaceName = 'SystemGroupShare'
  constructor(props: any) {
    super(props);
    this.state = {
      options: [],
      isModalVisible: false,
      isModalVisibleT: false,
      address: {
        refund_name: "",
        refund_phone: "",
        refund_province: "",
        refund_province_code: "",
        refund_city: "",
        refund_city_code: "",
        refund_area: "",
        refund_area_code: "",
        refund_detail: "",
      },
      status: 0,
      default_addr: false,
      refuse: '',
      applyid: ""
    };
    this.onFinishFailed = this.onFinishFailed.bind(this);
    this.onFinish = this.onFinish.bind(this);
    this.decline = this.decline.bind(this);
    this.onChangeCode = this.onChangeCode.bind(this);
    this.agree = this.agree.bind(this);
  }
  getRadioValue(): Labels {
    return Labels.share;
  }
  componentDidMount() {
    const { id } = this.props.location.query;
    this.setState({ id });
    this.getOrderInfo({ order_id: id });
    this.adress();
  }
  //申请详情
  async getOrderInfo(value) {
    const pitchOn = {
      0: false,
      1: true
    };
    try {
      const data = await serve.applyDetail(value);
      const { address } = data;
      console.log('address: ', address);
      if (address) {
        const refund_address = _.mapKeys(address, ((_value, key) => {
          return "refund_" + key;
        }));
        this.setState({
          applyid: data.id,
          status: data.status,
          default_addr: pitchOn[data.default_addr],
          refuse: data.refuse,
          address: refund_address,
        });
      } else {
        this.setState({
          applyid: data.id,
          status: data.status,
          default_addr: pitchOn[data.default_addr],
          refuse: data.refuse
        });
      }

    } catch (error) {
      //todo
    }
  }
  //城市地区请求
  async adress() {
    try {
      const data = await serve.cityFor();
      this.setState({
        options: data
      });
    } catch (error) {
      //tode
    }
  }
  onChangeCode(_value, selectedOptions) {
    Object.assign(parm, {
      "area_code": selectedOptions[2].area_code,
      "city_code": selectedOptions[1].area_code,
      "province_code": selectedOptions[0].area_code,
    });
  }
  //审核处理
  async auditDispose(value) {
    try {
      await serve.auditDispose(value);
    } catch (error) {
      //todo
    }
  }
  //商家默认城市请求
  async groupInfo() {
    try {
      const data = await serve.groupInfo();
      const address = _.pick(data, _.keys(this.state.address));
      this.setState({ address });
    } catch (error) {
      //tode
    }
  }
  //添加新地址
  showModal(flag) {
    this.setState({
      isModalVisible: flag,
      default_addr: false
    });
  }
  //驳回模态框
  showModals(flag) {
    this.setState({
      isModalVisibleT: flag,
    });
  }
  //新添加地址按钮
  onFinish(values) {
    const newTestData = Object.assign(this.state.address, {
      refund_province: values.adress[0],
      refund_city: values.adress[1],
      refund_area: values.adress[2],
      refund_detail: values.detail,
      refund_name: values.name,
      refund_phone: values.phone,
    });
    this.setState({
      address: newTestData,
      isModalVisible: false
    });
  }
  //驳回按钮
  decline(values) {
    try {
      const dayalir = { id: this.state.applyid, status: 2, refuse: values.refuse };
      this.auditDispose(dayalir);
      this.setState({ isModalVisibleT: false, status: 2, refuse: values.refuse });
    } catch (error) {
      //todo
    }

  }
  //同意
  agree() {
    const { address, applyid, default_addr } = this.state;
    console.log('default_addr: ', default_addr);
    const delAddress = _.mapKeys(address, ((_value, key) => {
      const reg = new RegExp("refund_");
      return key.replace(reg, "");
    }));
    const pitchOn = { false: 0, true: 1 };
    try {
      const dayalir = Object.assign(parm, delAddress, { id: applyid, status: 1, default_addr: pitchOn[default_addr] });
      this.auditDispose(dayalir);
      this.getOrderInfo({ order_id: this.state.id });
    } catch (error) {
      //todo
    }
  }
  //校验
  onFinishFailed(errorInfo: any) {
    console.log('errorInfo: ', errorInfo);
  }
  //选择默认地址
  async onSelect(e) {
    console.log(e.target.checked);
    if (e.target.checked) {
      this.groupInfo();
    } else {
      const list = {
        refund_name: "",
        refund_phone: "",
        refund_province: "",
        refund_province_code: "",
        refund_city: "",
        refund_city_code: "",
        refund_area: "",
        refund_area_code: "",
        refund_detail: "",
      };
      this.setState({ address: list });
    }
    this.setState({ default_addr: e.target.checked });
  }
  private getGoodsPrice(address): React.ReactNode {
    return (
      <div>
        {address.refund_name + address.city + address.area + address.detail}
      </div>
    );
  }
  //按钮模块
  operation(status) {
    if (status === 1 || status === 2) {
      return (null);
    } else {
      return (
        <div className="mt20">
          <Button className="ml20" type="primary" onClick={this.agree}>同意</Button>
          <Button className="ml20" type="primary" onClick={this.showModals.bind(this, true)}>驳回</Button>
        </div>
      );
    }
  }
  getContent(): React.ReactNode {
    const { isModalVisible, isModalVisibleT, default_addr, address, status, refuse } = this.state;
    console.log('address: ', address);
    return (
      <div className="pt20">
        {status === 1 || status === 0 ? <Form onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} autoComplete="off">
          <Form.Item label="设置退货信息" >
            {status === 1 || status === 2 ? null : <div>
              <Checkbox checked={default_addr} onClick={this.onSelect.bind(this)} >使用默认地址</Checkbox>
              <Button type="link" onClick={this.showModal.bind(this, true)}>添加新地址</Button>
            </div>
            }
          </Form.Item>
          <div className="ml100">
            <Card title="收货地址" className="w100">
              <div className="dfx-jcsb">
                <div className="mt10">收件姓名：{address.refund_name}</div>
                <div className="mt10">手机号：{address.refund_phone}</div>
                <div className="mt10">收货地址： {address.refund_province} {address.refund_city} {address.refund_area} {address.refund_detail}
                </div>
              </div>
            </Card>
          </div>
          <Form.Item>
            {this.operation(status)}
          </Form.Item>
        </Form> : null}
        <div>
          <Modal title="新地址" visible={isModalVisible} footer={null} onCancel={this.showModal.bind(this, false)} maskClosable={false}>
            <Form onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} autoComplete="off">
              <Form.Item label="所在地区" name="adress" rules={[{ required: true, message: '请输入退货地址' }]}>
                <Cascader options={this.state.options} onChange={this.onChangeCode} fieldNames={{ label: "area_name", value: "area_name" }} />
              </Form.Item>
              <Form.Item label="详细地址" name="detail" rules={[{ required: true, message: '请输入收货人姓名' }]}>
                <Input ></Input>
              </Form.Item>
              <Form.Item label="收货人姓名" name="name" rules={[{ required: true, message: '请输入收货人姓名' }]}>
                <Input ></Input>
              </Form.Item>
              <Form.Item label="收货人手机号" name="phone" rules={[{ required: true, message: '请输入收货人手机号' }]}>
                <Input ></Input>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">确定</Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
        {status === 2 ? <div>
          <p>
            <span>驳回原因：</span>
            <span>{refuse}</span>
          </p>
        </div> : null}

        <div className="w350 pt20">
          <Modal title="新地址" visible={isModalVisibleT} footer={null} onCancel={this.showModals.bind(this, false)} maskClosable={false}>
            <Form onFinish={this.decline} onFinishFailed={this.onFinishFailed}>
              <Form.Item label="驳回原因" name="refuse">
                <Input.TextArea></Input.TextArea>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">确定</Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}

