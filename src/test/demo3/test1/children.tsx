/**
 * @file 子组件接收数据
 * @author svon.me@gmail.com
 */

import React, { Component } from 'react';
import { Card } from 'antd';

export interface Props{
  text?: string;
}

export default class Children extends Component<Props> {
  render () {
    return (<Card title="这里是子组件">
      <p>接收到的父组件内容: { this.props.text }</p>
    </Card>);
  }
}