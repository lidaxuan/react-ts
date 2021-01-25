/**
 * @file 函数式组建
 * @author svon.me@gmail.com
 */
import React from 'react';
import { Props } from './props';

// 如果该方法为内部方法，可以添加 private 关键字
const getSrc = function(props: Props): string {
  // 获取组建中定义的参数
  const { width, height, text } = props;
  const src = `http://iph.href.lu/${width}x${height}`;
  if (text) {
    return `${src}?text=${text}`;
  }
  return src;
};

const Source = function(props: Props): React.ReactElement {
  // return (<img src={ getSrc(props) }/>);
  return (<span>{ `src = ${getSrc(props)}` }</span>);
};

export default Source;