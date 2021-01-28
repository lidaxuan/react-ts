/*
 * @Description: 
 * @Author: 李继玄（15201002062@163.com）
 * @Date: 2021-01-26 16:02:32
 * @FilePath: /react-ts/src/pages/test/study.tsx
 */
import React, { Component } from 'react';
import { Button, Tabs } from 'antd';
const { TabPane } = Tabs;

// const Clock = React.lazy( () => import('./classify/clock') );
import Clock from './classify/clock';
import HighOrderComponents from './classify/highOrderComponents';
import MouseTracker from './classify/prop';
import MouseMove from './classify/mouseMove';
// import Hook from './classify/hook';

export default class In extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      num: 0,
      obj: {
        name: "李大玄",
        age: 18,
        co: {
          a: 1
        }
      },
      lazy: "const Clock = React.lazy( () => import('./classify/clock') );"
    };
    this.add = this.add.bind(this);
    this.eatMelon = this.eatMelon.bind(this);
    this.callback = this.callback.bind(this);
  }
  componentDidMount() {
    // 1
  }
  add() {
    const num = this.state.num + 1;
    this.setState({
      num
    });
  }
  eatMelon(e) {
    alert(e);
  }
  callback(e) {
    console.log(e);
    
  }
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="9" onChange={this.callback}>
          <TabPane tab="react.lazy" key="1">
            {this.state.lazy}
          </TabPane>
          <TabPane tab="定时器" key="2">
            <Clock />
          </TabPane>
          <TabPane tab="dangerouslySetInnerHTML" key="3">
            <pre dangerouslySetInnerHTML={{ __html: JSON.stringify(this.state.obj) }}></pre>
            <hr/>
            <pre dangerouslySetInnerHTML={{ __html: '<Button data-asd="asdasd" onClick={this.eatMelon.bind(this, 1)}>吃瓜群众</Button>' }}></pre>
          </TabPane>
          <TabPane tab="函数传参的两种写法" key="4">
            <Button data-asd="asdasd" onClick={this.eatMelon.bind(this, 1)}>吃瓜群众</Button>
            {JSON.stringify('<Button data-asd="asdasd" onClick={this.eatMelon.bind(this, 1)}>吃瓜群众</Button>')}
            <hr/>
            <Button data-asd="asdasd" onClick={() => {this.eatMelon(1);}}>吃瓜群众</Button>
            {JSON.stringify('<Button data-asd="asdasd" onClick={() => {this.eatMelon(1)}}>吃瓜群众</Button>')}
          </TabPane>
          <TabPane tab="Fragment" key="5">
            <>
              <td>123</td>
              <td>546</td>
            </>
            <hr/>
            <React.Fragment>
              <td>asdad</td>
              <td>asdad</td>
            </React.Fragment>
          </TabPane>
          <TabPane tab="高阶组件" key="6">
            <HighOrderComponents></HighOrderComponents>
          </TabPane>
          <TabPane tab="prop" key="7">
            <MouseTracker></MouseTracker>
          </TabPane>
          <TabPane tab="prop" key="8">
            <MouseMove></MouseMove>
          </TabPane>
          <TabPane tab="prop" key="9">
            <MouseMove></MouseMove>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}