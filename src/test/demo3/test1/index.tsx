/**
 * @file 父与子通信
 * @author svon.me@gmail.com
 */


import React, { Component } from 'react';
import { Row, Col, Input, Tag } from 'antd';
import Children from './children';

interface State{
  text: string;
}

export default class Demo3Test1 extends Component<any, State> {
  // 此处为第二种方式设置 state 数据默认值
  // 与 Demo1 & Demo2 中的方式不同 (其都是在构造函数中通过 this.state 进行默认值处理)
  // 此处是通过 class的实例时进行 state 的初始值设置
  // 两种方式都可以，避免同时使用
  state = {
    text: ''
  }
  render (): React.ReactElement {
    // input 数据变化时
    const onChange = (e: any) => {
      const target: HTMLInputElement = e.target;
      if (target) {
        const text: string = target.value;
        // 修改 state 中的 text 值
        this.setState({ text });
      }
    };
    return (<div>
      <div>
        <Tag color="#108ee9">父子组件通信</Tag>
        <Tag color="#f50">父传子</Tag>
      </div>
      <Row>
        <Col span={ 8 }>
          <p>这里是父组件</p>
          <div>
            <Input placeholder="请在此输入内容" value={ this.state.text } onChange={ onChange }></Input>
          </div>
        </Col>
        <Col span={ 4 }></Col>
        <Col span={ 12 }>
          <Children text={ this.state.text }></Children>
        </Col>
      </Row>
    </div>);
  }
}