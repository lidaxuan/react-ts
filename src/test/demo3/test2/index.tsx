/**
 * @file 父与子通信, 子与父交互
 * @author svon.me@gmail.com
 */

import React from 'react';
// 引入 test1 的案例
import Test1 from '../test1/index';
import Children from './children';
import { Col, Input, Row, Tag } from 'antd';

/**
 * 子与父交互的核心思想是执行父类通过属性(props)把其自身的一个方法传给子组件
 * 子组件根据业务逻辑在合适的地方执行该方法
 */

// 继承 test1 的代码逻辑
export default class Demo3Test1 extends Test1 {
  constructor(props: any) {
    super(props);
    this.onRest = this.onRest.bind(this);
  }
  // 重置输入框内容
  private onRest(): void {
    this.setState({ text: '' });
  }
  // 重写父类(Test1)中的 render 方法
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
        <Tag color="#f50">子与父交互</Tag>
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
          <Children text={ this.state.text } onRest={ this.onRest }></Children>
        </Col>
      </Row>
    </div>);
  }
}