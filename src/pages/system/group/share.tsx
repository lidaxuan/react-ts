/**
 * @file 商户分享信息
 */

import React from 'react';
import SystemGroup, { Labels } from './common';
import { Form, Input, Button, message } from 'antd';
import { CopyOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import * as serve from 'src/model/system/index';

const Keys = {
  applet_url: 'applet_url',
  applet_qrcode: 'applet_qrcode',
};

const pram = {
  applet_qrcode: '',
  applet_url: ''
};

export default class SystemGroupShare extends SystemGroup<any, any> {
  formSpaceName = 'SystemGroupShare'
  getRadioValue(): Labels {
    return Labels.share;
  }
  // 默认值
  initialValues() {
    const data = {};
    data[Keys.applet_url] = '';
    data[Keys.applet_qrcode] = '';
    return data;
  }
  componentDidMount() {
    this.tenantInfo();
  }
  listAssign(a, b) {
    return Object.keys(a).forEach((key) => {
      a[key] = b[key] || a[key];
    });
  }
  cutout(value) {
    const index = value.indexOf("/uploads");
    return value.substring(index);
  }

  async tenantInfo(value?: any): Promise<void> {
    try {
      const data = await serve.groupInfo();

      this.setFieldSValue(data);
    } catch (err) {
      //todo
    }
  }

  getContent(): React.ReactNode {
    return (
      <div className="w350 pt20">
        <Form.Item label="小程序地址" name={Keys.applet_url}>
          <Input></Input>
          {/* <div className="flex">
            <div><Input></Input></div>
            <div className="ml10"><Button type="primary" icon={<CopyOutlined />} /></div>
          </div> */}
        </Form.Item>
        <Form.Item label="小程序二维码" name={Keys.applet_qrcode}>
          <div className="flex">
            <img className="goodsImg" src={Keys.applet_qrcode}></img>
            <div className="ml20 mt30"><Button type="primary" icon={<VerticalAlignBottomOutlined />} size="small" /></div>
          </div>
        </Form.Item>
      </div>
    );
  }
  // 保存
  async onSubmit() {
    try {
      const data = this.getFieldsValue();
      this.listAssign(pram, data);
      pram.applet_qrcode = this.cutout(pram.applet_qrcode);
      pram.applet_url = this.cutout(pram.applet_url);
      // await serve.share(pram);
      message.success('保存成功');
    } catch (err) {
      //todo
    }
  }
}

