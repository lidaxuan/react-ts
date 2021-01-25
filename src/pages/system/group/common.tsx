/**
 * @file 商户设置
 */

import React, { Component } from 'react';
import { Radio, Form, Button } from 'antd';
import { Link } from 'react-router';
import { routers } from 'src/routers/config';
import { FormInstance } from 'antd/lib/form';

// 枚举
export enum Labels {
  group = '商户信息',
  share = '分享信息',
  service = '售后设置'
}


export default abstract class SystemGroup<Props, State> extends Component<Props, State> {
  submitLable = '保存'
  formRef = React.createRef<FormInstance>();
  constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }
  abstract formSpaceName: string
  // 抽象方法，父类定义规则，实现由继承的子类来处理
  abstract getRadioValue(): Labels
  // 表单的具体内容
  abstract getContent(): React.ReactNode
  abstract onSubmit(): void
  getFormLabel() {
    return {
      labelCol: {
        style: {
          width: '110px'
        }
      },
      autoComplete: 'off'
    };
  }

  initialValues(): any {
    return {};
  }

  // 获取某一个表单数据
  protected getFieldValue<T>(key: string): T {
    if (this.formRef) {
      const { current } = this.formRef;
      if (current && current.getFieldValue) {
        const value: T = current.getFieldValue(key);
        return value;
      }
    }
    return void 0;
  }
  // 获取所有表单数据
  protected getFieldsValue<T>(): T {
    if (this.formRef) {
      const { current } = this.formRef;
      if (current && current.getFieldsValue) {
        return current.getFieldsValue();
      }
    }
    return void 0;
  }
  // 设置某一个表单数据
  protected setFieldValue(key: string, value: any): void {
    const data = {};
    data[key] = value;
    this.setFieldSValue(data);
  }
  // 设置一组表单数据
  protected setFieldSValue(data: any): void {
    if (this.formRef) {
      const { current } = this.formRef;
      if (current && current.setFieldsValue) {
        return current.setFieldsValue(data);
      }
    }
  }
  render(): React.ReactElement {
    return (
      <div>
        <div>
          <Radio.Group buttonStyle="solid" value={this.getRadioValue()}>
            <Radio.Button value={Labels.group}>
              <Link className="dibk" to={routers.system.group.info}>{Labels.group}</Link>
            </Radio.Button>
            <Radio.Button value={Labels.share}>
              <Link className="dibk" to={routers.system.group.share}>{Labels.share}</Link>
            </Radio.Button>
            <Radio.Button value={Labels.service}>
              <Link className="dibk" to={routers.system.group.service}>{Labels.service}</Link>
            </Radio.Button>
          </Radio.Group>
        </div>
        <div>
          <Form ref={this.formRef} initialValues={this.initialValues()} onFinish={this.onSubmit} name={this.formSpaceName} {...this.getFormLabel()}>
            {this.getContent()}
            <div className="pt20 ml40">
              <Form.Item>
                <Button type="primary" htmlType="submit">保存</Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>);
  }
}

