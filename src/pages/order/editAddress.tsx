/**
 * @file 修改收货信息
 * @author 15201002061@163.com
 */

import _ from 'lodash';
import React, { Component } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Button, Form, Input, Cascader } from 'antd';
import { getArea, editAddress } from '../../model/order';
import DB from '@fengqiaogang/dblist';
export interface State {
  [key: string]: any;
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



export default class EditAddress extends Component<Props, State> {
  formRef = React.createRef<FormInstance>();
  formSpaceName = 'editAddress'; // 表单命名空间，防止组建重复使用，避免冲突
  constructor(props: any) {
    super(props);
    this.setFormVal = this.setFormVal.bind(this);
    this.onChangeValues = this.onChangeValues.bind(this);
    this.onFinish = this.onFinish.bind(this);
    this.getFieldValue = this.getFieldValue.bind(this);
    this.onCascaderChange = this.onCascaderChange.bind(this);
    this.state = {
      area: [],
      userInfo: {}
    };
  }

  // 初始化方法
  async componentDidMount() {
    const data = this.props.form;
    data.area = [];
    data.address.addressId = data.address.id;
    const userInfo = _.assign({}, data, data.address);
    userInfo.area = [].concat([], userInfo.province_code, userInfo.city_code, userInfo.area_code);
    this.setFormVal(userInfo);
    const area = await getArea() || []; // 获取联动

    this.setState({
      userInfo: userInfo,
      area: [].concat([], area),
    });
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
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

  }

  async onFinish(val) {
    const userInfo = this.state.userInfo;
    const db = new DB([], 'id', 'pid');
    const data = db.flatten(this.state.area, 'children');
    const datafl = new DB(data, 'id');
    const selectAreaArr = datafl.select({ area_code: val.area });
    const obj = {
      id: userInfo.addressId,
      name: val.name,
      phone: val.member_phone,
      detail: val.detail,
      province_code: val.area[0],
      city_code: val.area[1],
      area_code: val.area[2],
      province: selectAreaArr[0]['area_name'],
      city: selectAreaArr[1]['area_name'],
      area: selectAreaArr[2]['area_name'],
    } as any;
    const { id } = await editAddress(obj);
    if (id) {
      this.props.getOrderInfo();
      this.props.handleConsigneeCancel();
    }
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

  // 省市区联动
  onCascaderChange(value): void {
    console.log(value);
  }
  /** 姓名 */
  protected getNameView(): React.ReactNode {
    const key = 'name';
    // 获取
    const message = '请输入姓名';
    const rules = [
      { required: true }
    ];
    return (<Form.Item name={key} label="姓名" rules={rules}>
      <Input placeholder={message} />
    </Form.Item>);
  }
  /** 年龄 */
  protected getTelView(): React.ReactNode {
    const key = 'member_phone';
    // 获取
    const message = '请输入联系方式';
    const rules = [
      { required: true }
    ];
    return (<Form.Item name={key} label="联系方式" rules={rules}>
      <Input style={{ width: '100%' }} placeholder={message} maxLength={length} />
    </Form.Item>);
  }
  // 省市区
  protected getAreaView(): React.ReactNode {
    const state = this.state;

    const key = 'area';
    // 获取
    const message = '请选择省市区';
    const rules = [
      { required: true }
    ];
    if (state.userInfo.area) {
      return (<Form.Item name={key} label="省市区" rules={rules}>
        {/* <div> */}
        <Cascader
          options={state.area}
          onChange={this.onCascaderChange}
          fieldNames={{ value: 'area_code', label: 'area_name' }}
          // defaultValue={state.userInfo.area}
          placeholder={message} />
        {/* </div> */}
      </Form.Item>);
    }
    return void 0;
  }
  // 详细地址
  protected getAddressView(): React.ReactNode {
    const key = 'detail';
    // 获取
    const message = '请输入地址';
    const rules = [
      { required: true }
    ];
    return (<Form.Item name={key} label="地址" rules={rules}>
      <Input style={{ width: '100%' }} placeholder={message} />
    </Form.Item>);
  }
  protected getContent(): React.ReactNode {
    const state = this.state;
    const props = {
      ...formProps,
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
      },
      initialValues: {
        name: '',
        // prefix: '86',
      },
      ref: this.formRef,
      name: this.formSpaceName,
      onFinish: this.onFinish,
      onValuesChange: this.onChangeValues
    };
    return (<Form {...props}>
      {this.getNameView()}
      {this.getTelView()}
      {this.getAreaView()}
      {this.getAddressView()}
      <Form.Item>
        <div className="form-btn">
          <Button type="primary" className="mr20" onClick={this.props.handleConsigneeCancel} htmlType="submit">取消</Button>
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