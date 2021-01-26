/*
 * @Description: 
 * @Author: 李继玄（15201002062@163.com）
 * @Date: 2021-01-26 16:02:32
 * @FilePath: /react-ts/src/pages/test/study.tsx
 */
import React, { Component } from 'react';
import { Button } from 'antd';

export default class In extends Component<any, any> {
  
  constructor(props: any) {
    super(props);
    this.state = {
      num: 0,
    };
    this.add = this.add.bind(this);
  }
  componentDidMount() {
  }
  add() {
    const num = this.state.num + 1;
    this.setState({
      num
    });
  }
  render() {
    return (
      <div>
        <Button onClick={this.add}>加一</Button>
        <br/>
        {this.state.num}
      </div>
    );
  }
}