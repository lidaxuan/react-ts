/**
 * @file 子组件接收数据
 * @author svon.me@gmail.com
 */

import React from 'react';
import { Card, Button } from 'antd';

interface Props{
  text?: string;
  onRest?: any;
}

// 函数式组件
const Children: React.FC<Props> = function(props: Props): React.ReactElement {
  const click = () => {
    if (props.onRest) {
      // 如果有参数需要传给父组件
      // 父组件需要对 onRest 定义参数
      // 在执行 onRest 时传入参数
      props.onRest(); // 执行父组件通过 props 传入的方法
    }
  };
  return (<Card title="这里是子组件">
    <div>
      <p>接收到的父组件内容: { props.text }</p>
      <div>
        <Button type="primary" onClick={ click }>重置父组件中输入框内容</Button>
      </div>
    </div>
  </Card>);
};

export default Children;
