/**
 * @file 商户售后信息
 */

import React from 'react';
import SystemGroup, { Labels } from './common';
import { Form, Input, Radio, Cascader, message } from 'antd';
import * as serve from 'src/model/system/index';
import _ from 'lodash';

const Keys = {
  service_type: 'service_type',
  adress: "adress",
};


export default class SystemGroupService extends SystemGroup<any, any> {
  formSpaceName = 'SystemGroupService'
  constructor(props: any) {
    super(props);
    this.state = {
      options: [],
      pram: {
        wechat_app_id: '',
        wechat_key: '',
        refund_province: '',
        refund_province_code: '',
        refund_city: '',
        refund_city_code: '',
        refund_area: '',
        refund_area_code: '',
        refund_detail: '',
        refund_name: '',
        refund_phone: '',
        service_type: '',
        service_info: '',
      }
    };
  }

  getRadioValue(): Labels {
    return Labels.service;
  }
  // 默认值
  initialValues() {
    const data = {};
    data[Keys.service_type] = 1;
    data[Keys.adress] = [];
    return data;
  }

  componentDidMount() {
    this.tenantInfo();
    this.adress();
  }

  async adress() {
    const data = await serve.cityFor();
    this.setState({
      options: data
    });
  }
  async tenantInfo(value?: any): Promise<void> {
    try {
      const data = await serve.groupInfo();
      const adress = [data.refund_province, data.refund_city, data.refund_area, data.refund_detail];
      const prams = _.pick(data, _.keys(this.state.pram));
      this.setState({
        pram: prams
      });
      this.setFieldValue(Keys.adress, adress);
      this.setFieldSValue(data);
    } catch (err) {
      //todo
    }
  }
  onChange = (value, selectedOptions) => {
    const newTestData = Object.assign(this.state.pram, {
      "refund_province": value[0],
      "refund_city": value[1],
      "refund_area": value[2],
      "refund_area_code": selectedOptions[2].area_code,
      "refund_city_code": selectedOptions[1].area_code,
      "refund_province_code": selectedOptions[0].area_code,
    });
    this.setState({
      pram: newTestData
    });
  }
  getContent(): React.ReactNode {
    return (
      <div className="w350 pt20">
        <Form.Item label="所在地区" name={Keys.adress} rules={[{ required: true, message: '请输入退货地址' }]}>
          <Cascader options={this.state.options} fieldNames={{ label: "area_name", value: "area_name" }} onChange={this.onChange} />
        </Form.Item>
        <Form.Item label="退货详细地址" name="refund_detail" rules={[{ required: true, message: '请输入收货人姓名' }]}>
          <Input ></Input>
        </Form.Item>
        <Form.Item label="收货人姓名" name="refund_name" rules={[{ required: true, message: '请输入收货人姓名' }]}>
          <Input ></Input>
        </Form.Item>
        <Form.Item label="收货人手机号" name="refund_phone" rules={[{ required: true, message: '请输入收货人手机号' }]}>
          <Input ></Input>
        </Form.Item>
        <Form.Item label="客服方式" name={Keys.service_type} rules={[{ required: true, message: '请选择客服方式' }]}>
          <Radio.Group>
            <Radio value={1}>微信</Radio>
            <Radio value={2}>手机号</Radio>
          </Radio.Group>
        </Form.Item>
        <div className="ml40">
          <Form.Item label="" name="service_info" rules={[{ required: true, message: '请输入' }]}>
            <Input ></Input>
          </Form.Item>
        </div>
      </div>);
  }
  // 保存
  async onSubmit() {
    try {
      const data = this.getFieldsValue();
      const prams = Object.assign(this.state.pram, data);
      await serve.refund(prams);
      message.success('保存成功');
    } catch (err) {
      //todo
    }
  }
}

