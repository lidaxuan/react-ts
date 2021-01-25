/**
 * @file 父与子通信, 子与父交互
 * @author svon.me@gmail.com
 */

import React from 'react';
import Add from './add';
import Subtract from './subtract';
import { Col, Row, Tag } from 'antd';

interface State {
  count?: number;
}


/**
 * 子与子之间的通信是基于子与父的基础而实现的
 * 把子与子之间需要使用的数据抽离，存放到父组件之上
 * 不论哪一个子组件对其进行修改，其余的子组件都能接收到变化后的数据
 */

// 继承 test1 的代码逻辑
export default class Demo3Test1 extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    // 设置默认值
    this.state = {
      count: 0
    };
  }
  render (): React.ReactElement {
    const onChange = (count: number) => {
      this.setState({ count });
    };
    return (<div>
      <div>
        <Tag color="#108ee9">父子组件通信</Tag>
        <Tag color="#f50">父传子</Tag>
        <Tag color="#f50">子与父交互</Tag>
        <Tag color="#f50">兄弟之间交互</Tag>
      </div>
      <Row style={{ paddingTop: '10px' }}>
        <Col span={ 4 }>
          <p>这里是父组件</p>
          <div>
            <p>count: { this.state.count || 0 }</p>
          </div>
        </Col>
        <Col span={ 8 }>
          <Add number={ this.state.count } onChange={ onChange }></Add>
        </Col>
        <Col span={ 2 }></Col>
        <Col span={ 8 }>
          <Subtract number={ this.state.count } onChange={ onChange }></Subtract>
        </Col>
      </Row>
    </div>);
  }
}