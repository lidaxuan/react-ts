/*
 * @Description: 高阶组件
 * @Author: 李继玄（15201002062@163.com）
 * @Date: 2021-01-27 11:28:15
 * @FilePath: /react-ts/src/pages/test/classify/highOrderComponents.tsx
 */

import React, { Component } from 'react';
interface State {
  [key: string]: any
}

interface Props {
  [key: string]: any
}

const Hoc = (Comp) => {//参数首字母必须大写，必须要有返回值，在下面使用
  return class Aasd extends Component<any, any> { //类名可以省略，省略的话标签名就是以temp或者其他的代替，必须要有返回值
    constructor(props) {
      super(props);
      this.banner = this.banner.bind(this);
    }
    banner(){//这里是实现某个功能的函数代码
      return 'zhangyue';
    }
    render() {
      return (
        <Comp banner={this.banner}></Comp>//将参数当做一个组件返回出去
      )
    }
  }
}
class A extends Component<State, Props> {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    const { banner } = this.props as any;
    console.log(banner());
    
  }
  render() {
    return (
      <div>
        <p> A组件 </p>
        { this.props.banner()} //在下面使用了高阶组件后，这里就可以直接使用里面的方法了
      </div>
    )
  }
}

class B extends Component<State, Props> {
  render() {
    return (
      <div>
        <p> B组件 </p>
        { this.props.banner()}
      </div>
    )
  }
}

const HocA = Hoc(A)//组件名必须首字母大写，将组件名当参数传进去，这样这个组件就有高阶组件内的方法了
const HocB = Hoc(B)


class C extends Component {
  render() {
    return (
      <div>
        <p> C组件 </p>
        <HocA></HocA>//这里使用的高阶组件
        <br/>
        <br/>
        <br/>
        <HocB></HocB>
      </div>
    )
  }
}
export default C


