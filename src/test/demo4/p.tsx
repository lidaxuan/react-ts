/**
 * @file 修改收货信息
 * @author 15201002061@163.com
 */

import _ from 'lodash';
import React, { Component } from 'react';
import Son from './son';
import { Button } from 'antd';
export interface State {
  [key: string]: any;
}

export interface Props {
  [key: string]: any;
}



export default class EditAddress extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      son: ''
    } as State;
    this.getVal = this.getVal.bind(this);
  }
  
  // 初始化方法
  
  componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
  }
  getVal() {
    console.log(this.state.son);
    
  }
  onRef = (val) => {
    this.setState({
      son: val
    });
  }
  
  render(): React.ReactElement {
    return (<div>
      <div>父组件
        <Button onClick={this.getVal}>asdasd</Button>
        <Son asdasd={this.onRef}></Son>
      </div>
    </div>);
  }
}