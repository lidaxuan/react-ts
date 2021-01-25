/**
 * @file 组建之间的数据交互
 * @author svon.me@gmail.com
 */

import React from 'react';
import { Row, Col } from 'antd';
import Test1 from './test1/index';
import Test2 from './test2/index';
import Test3 from './test3/index';

export default class Demo3 extends React.Component {
  render(): React.ReactElement {
    return (
      <Row>
        <Col span={ 24 }>
          <Test1></Test1>
        </Col>
        <Col span={ 24 }>
          <hr></hr>
        </Col>
        <Col span={ 24 }>
          <Test2></Test2>
        </Col>
        <Col span={ 24 }>
          <hr></hr>
        </Col>
        <Col span={ 24 }>
          <Test3></Test3>
        </Col>
      </Row>
    );
  }
}

