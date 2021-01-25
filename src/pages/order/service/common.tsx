/**
 * @file 公共文件
 */

import React, { Component } from 'react';
import { Radio, Form, Button } from 'antd';
import { Link } from 'react-router';
import { routers } from 'src/routers/config';
import { FormInstance } from 'antd/lib/form';

// 枚举
export enum Labels {
  detail = '订单详情',
  apply = '申请详情',
  share = '审核处理',
  service = '退款处理'
}


export default abstract class SystemGroup<Props, State> extends Component<Props, State> {
  submitLable = '保存'
  constructor(props: any) {
    super(props);
  }
  abstract formSpaceName: string
  // 抽象方法，父类定义规则，实现由继承的子类来处理
  abstract getRadioValue(): Labels
  //具体内容
  abstract getContent(): React.ReactNode

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

  render(): React.ReactElement {
    const { location = {} } = this.props as any;
    const { query = {} } = location;
    return (
      <div>
        <div>
          <Radio.Group buttonStyle="solid" value={this.getRadioValue()}>
            <Radio.Button value={Labels.detail}>
              <Link className="dibk" to={ { pathname: routers.order.service.detail, query } }>{Labels.detail}</Link>
            </Radio.Button>
            <Radio.Button value={Labels.apply}>
              <Link className="dibk" to={{ pathname: routers.order.service.apply, query }}>{Labels.apply}</Link>
            </Radio.Button>
            <Radio.Button value={Labels.share}>
              <Link className="dibk" to={{ pathname: routers.order.service.audit, query }}>{Labels.share}</Link>
            </Radio.Button>
            <Radio.Button value={Labels.service}>
              <Link className="dibk" to={{pathname: routers.order.service.refund, query}}>{Labels.service}</Link>
            </Radio.Button>
          </Radio.Group>
        </div>
        <div>
          {this.getContent()}
        </div>
      </div>);
  }
}

