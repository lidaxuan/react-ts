/*
 * @Description: prop
 * @Author: 李继玄（15201002062@163.com）
 * @Date: 2021-01-28 09:47:56
 * @FilePath: /react-ts/src/pages/test/classify/prop.tsx
 */
import React, { Component } from 'react';

interface State {
  [key: string]: any
};
interface Props {
  [key: string]: any
};
interface MouseTrackerState {
  x?: number | string;
  y?: number | string;
  [key: string]: any;
}

interface GoodsProps {
  [key: string]: any;
}
export default class MouseTracker extends React.Component<Props, MouseTrackerState> {
  constructor(props) {
    super(props);
    this.state = this.initState();
    this.getTitle = this.getTitle.bind(this);
    this.initState = this.initState.bind(this);
    this.getPosition = this.getPosition.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }
  initState() {
    return {
      x: 0,
      y: 0
    }
  }
  handleMouseMove(e) {
    this.setState({
      x: e.clientX,
      y: e.clientY,
    })
  }
  getTitle() {
    return (
      <h4>鼠标的位置</h4>
    )
  }
  getPosition() {
    const { x, y } = this.state;
    return (
      <div>当前位置是x: {x}, y: {y}</div>
    )
  }
  render() {
    return (
      <div style={{height: '100vh',backgroundColor: 'pink'}} onMouseMove={this.handleMouseMove}>
        {this.getTitle()}
        {this.getPosition()}
      </div>
    )
  }

}