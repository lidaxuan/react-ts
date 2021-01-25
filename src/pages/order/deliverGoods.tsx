/**
 * @file 去发货
 * @author 15201002061@163.com
 */

import _ from 'lodash';
import React, { Component } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Button, Form, Input, Select } from 'antd';
import { logisticsUpdate, express } from '../../model/order';
import DB from '@fengqiaogang/dblist';
const { Option } = Select;
export interface State {
  [key: string]: any,
  companyArrs: any,
}

export interface Props {
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

export default class DeliverGoods extends Component<Props, State> {
  formRef = React.createRef<FormInstance>();
  formSpaceName = 'deliverGoods'; // 表单命名空间，防止组建重复使用，避免冲突
  constructor(props: any) {
    super(props);
    this.onChangeValues = this.onChangeValues.bind(this);
    this.setFormVal = this.setFormVal.bind(this);
    this.onGenderChange = this.onGenderChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onFinish = this.onFinish.bind(this);
    this.state = {
      companyArrs: []
    };
  }

  // 初始化方法
  componentDidMount() {
    this.setFormVal(this.props.form);
    this.express({ name: '' });
  }
  //快递公司
  async express(value) {
    const data = await express(value);
    this.setState({ companyArrs: data });
  }
  protected setFormVal(data: Props) {
    if (this.formRef) {
      const { current } = this.formRef;
      if (current) {
        // 表单回填
        current.setFieldsValue(data);
      }
    }
  }
  // 表单数据修改
  protected onChangeValues(values: State): void {
    // 表单数据
    console.log(values);
  }

  async onFinish(values) {
    const { id } = this.props.id;
    const param = Object.assign({}, values, { type: 1, order_id: id });
    console.log('param: ', param);
    await logisticsUpdate(param);
    this.props.getOrderInfo();
    this.props.DeliverCancel();
  }

  protected getFieldValue<T>(key: any): T {
    if (this.formRef) {
      const { current } = this.formRef;
      if (current && current.getFieldValue) {
        const value: T = current.getFieldValue(key);
        return value;
      }
    }
    return void 0;
  }

  onGenderChange(value) {
    console.log('value: ', value);
  }
  onSearch(val) {
    this.express({ name: val });
  }

  // 物流公司
  protected getCompanyView(): React.ReactNode {
    const { companyArrs } = this.state;
    console.log('companyArrs: ', companyArrs);
    const key = 'express_id';
    // 获取
    const message = '请输入地址';
    const rules = [
      { required: true }
    ];
    return (
      <Form.Item name={key} label="物流公司" rules={rules}>
        <Select
          placeholder="请选择物流公司"
          onChange={this.onGenderChange}
          filterOption={false}
          allowClear
          showSearch
          onSearch={this.onSearch}
        >
          {companyArrs.map(ele => {
            return (<Option key={ele.id} value={ele.id}>{ele.name}</Option>);
          })}
        </Select>
      </Form.Item >
    );
  }
  // 单号
  protected getOddNumView(): React.ReactNode {
    const key = 'express_number';
    // 获取
    const message = '请输入地址';
    const rules = [
      { required: true }
    ];
    return (<Form.Item name={key} label="物流单号" rules={rules}>
      <Input style={{ width: '100%' }} placeholder={message} />
    </Form.Item>);
  }
  protected getContent(): React.ReactNode {
    const props = {
      ...formProps,
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
      },
      ref: this.formRef,
      name: this.formSpaceName,
      onFinish: this.onFinish,
      onValuesChange: this.onChangeValues
    };
    return (<Form {...props}>
      {this.getCompanyView()}
      {this.getOddNumView()}
      <Form.Item label="">
        <p className="tip">* 请仔细填写物流公司及物流单号，发货后暂不支持修改</p>
      </Form.Item>
      <Form.Item>
        <div className="form-btn">
          <Button type="primary" className="mr20" onClick={this.props.DeliverCancel}>取消</Button>
          <Button type="primary" htmlType="submit">保存</Button>
        </div>
      </Form.Item>
    </Form>);
  }
  render(): React.ReactElement {
    return (<div>
      <div>
        {this.getContent()}
      </div>
    </div>);
  }
}