/*
 * @Description: 
 * @Author: 李继玄（15201002062@163.com）
 * @Date: 2021-01-27 10:13:44
 * @FilePath: /react-ts/src/pages/test/classify/clock.tsx
 */
import React from 'react';

export default class Clock extends React.Component<any, any> {
  timerID = void 0;
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
    this.tick = this.tick.bind(this);
  }
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}