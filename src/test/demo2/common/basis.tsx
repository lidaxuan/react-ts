/**
 * @file 表单基础部分
 * @author svon.me@gmail.com
 */

import _ from 'lodash';
import React, { Component } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Button, Form, Input, InputNumber } from 'antd';

export interface BasisState {
  [key: string]: any;
}

export interface BasisProps {
  [key: string]: any;
}

const formProps: any = {
  labelCol: {
    style: {
      width: '120px'
    }
  },
  autoComplete: 'off'
};

export default abstract class FormBasis<Props extends BasisProps, State extends BasisState> extends Component<Props, State> {
  formRef = React.createRef<FormInstance>();
  formSpaceName = ''; // 表单命名空间，防止组建重复使用，避免冲突
  constructor(props: any) {
    super(props);
    this.onFinish = this.onFinish.bind(this);
    this.onChangeValues = this.onChangeValues.bind(this);
    this.init();
  }
  // 初始化方法
  abstract init (): void;
  abstract onFinish(values: State): void;
  // 表单 title
  abstract getTitle(): React.ReactNode;
  // 表单数据修改
  protected onChangeValues(values: State): void {
    // 表单数据
    console.log(values);
  }
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
  /** 姓名 */
  protected getNameView(): React.ReactNode {
    const key = 'name';
    const length = 32;
    // 获取
    const value = this.getFieldValue<string>(key) || '';
    const message = '请输入姓名';
    const suffix: React.ReactNode = (
      <span>{value.length}/{length}</span>
    );
    const rules = [
      { required: true }
    ];
    return (<Form.Item name={ key } label="姓名" rules={ rules }>
      <Input placeholder={ message } maxLength={length} suffix={suffix} />
    </Form.Item>);
  }
  /** 年龄 */
  protected getAgeView(): React.ReactNode {
    const key = 'age';
    const length = 32;
    // 获取
    const message = '请输入年龄';
    const rules = [
      { required: true }
    ];
    return (<Form.Item name={ key } label="年龄" rules={ rules }>
      <InputNumber style={{ width: '100%' }} placeholder={ message } maxLength={length}/>
    </Form.Item>);
  }
  protected getContent(): React.ReactNode {
    const props = {
      ...formProps,
      layout: 'vertical',
      ref: this.formRef,
      name: this.formSpaceName,
      onFinish: this.onFinish,
      onValuesChange: this.onChangeValues
    };
    return (<Form { ...props }>
      {this.getNameView()}
      {this.getAgeView()}
      <Form.Item>
        <Button type="primary" htmlType="submit">保存</Button>
      </Form.Item>
    </Form>);
  }
  render (): React.ReactElement {
    return (<div>
      <div>
        { this.getTitle() }
      </div>
      <div>
        { this.getContent() }
      </div>
    </div>);
  }
}