/**
 * @file 修改收货信息
 * @author 15201002061@163.com
 */

import _, { chain } from 'lodash';
import React, { Component } from 'react';

import { goodsCategoryList, goodsCategoryAdd } from 'src/model/goods/goods';
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
  constructor(props: any) {
    super(props);
    this.state = {
      name: '李大玄',
      age: 1
    };
    this.change = this.change.bind(this);
  }
  
  // 初始化方法
  componentDidMount() {
    this.props.asdasd(this.state);
  }
  // componentWillUnmount = () => {
  //   this.setState = (state,callback)=>{
  //     return;
  //   };
  // }
  change(e) {
    const target: HTMLInputElement = e.target;
    const text: string = target.value;
    console.log(text);
    
  }
  
  render(): React.ReactElement {
    return (<div>
      <div>子组件11
        <input onChange={this.change}></input>
      </div>
    </div>);
  }
}