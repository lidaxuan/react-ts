/**
 * @file 动态生成图片
 * @author svon.me@gmail.com
 */


// 这里使用两个方式来定义组建
// Image 为传统模式 (使用 class 方式定义)
// Source 为最新的函数模式 (使用 function 定义)
// 建议新学者在处理复杂业务时使用 class 模式定义

import React, { Component } from 'react';
import Source from './source';
import { Props } from "./props";

// 将 Props 传入到 Component 类

export default class Image extends Component<Props> { 
  constructor(props: Props) {
    // 执行父类构造方法
    super(props); // 此行代码必须放在首行
  }
  // 如果该方法为内部方法，可以添加 private 关键字
  private getStyle() {
    const { width, height } = this.props;
    const style = {
      width: `${width}px`,
      height: `${height}px`,
      display: 'inline-block'
    };
    return style;
  }
  render(): React.ReactElement {
    return (
      <div style={ this.getStyle() }>
        <Source { ...this.props }/>
      </div>
    );
  }
}

