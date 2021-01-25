/*
 * @Author: MrZhang
 * @Date: 2021-01-05 09:49:18
 * @Description: 商户信息
 */

import React from 'react';
import SystemGroup, { Labels } from './common';
import { Form, Input, message } from 'antd';
import Upload from 'src/components/upload/index';
import * as serve from 'src/model/system/index';
import _ from 'lodash';

const Keys = {
  name: 'name',
  logo: 'logo',
};

interface State {
  wechat_app_id?: string;
  wechat_key?: string;
  name?: string;
  logo?: string;
}


export default class SystemGroupInfo extends SystemGroup<any, State> {
  formSpaceName = 'SystemGroupInfo'
  // 返回 Radio 默认选中的值

  getRadioValue(): Labels {
    return Labels.group;
  }
  // 默认值
  initialValues() {
    const data = {};
    data[Keys.name] = '';
    data[Keys.logo] = '';
    return data;
  }
  componentDidMount() {
    this.tenantInfo();
  }
  cutout(value: string): string {
    const index = value.indexOf("/uploads");
    return value.substring(index);
  }
  async tenantInfo(): Promise<void> {
    try {
      const data = await serve.groupInfo();
      // 只赋值 name 和 logo
      const value = _.pick(data, _.keys(Keys));
      this.setFieldSValue(value);
      // 保存 wechat_app_id 和 wechat_key
      this.setState(_.pick(data, ['wechat_app_id', 'wechat_key']));
    } catch (err) {
      //todo
    }
  }

  getContent(): React.ReactNode {
    const data = {
      type: 'merchant'
    };
    return (
      <div className="w350 pt20">
        <Form.Item name={Keys.name} label="商户名称" rules={[{ required: true, message: '请输入商户名称' }]}>
          <Input ></Input>
        </Form.Item>
        <Form.Item name={Keys.logo} label="商户logo" rules={[{ required: true, message: '请上传商户logo' }]}>
          <Upload accept="image/*" data={data}></Upload>
        </Form.Item>
      </div>
    );
  }
  // 保存
  async onSubmit() {
    try {
      const data = this.getFieldsValue();
      const param: State = _.assign({}, this.state, data);
      param.logo = this.cutout(param.logo);
      await serve.groupEdits(param);
      message.success('保存成功');
    } catch (err) {
      //todo
    }
  }
}

