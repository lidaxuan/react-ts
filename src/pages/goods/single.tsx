import React, { Component } from 'react';
import { InputNumber, message } from 'antd';
import * as serve from 'src/model/goods/goods';
import { EditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

export interface Props{
  info?: any;
  name?: string;
}
class State {
  openFlag: boolean;
  inputVal: number;
  initVal: number;
}


export default class SingleEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = new State();
    this.state = {
      openFlag: false,
      inputVal: this.props.info[this.props.name] / 100,
      initVal: this.props.info[this.props.name] / 100,
    };
    this.openFn = this.openFn.bind(this);
    this.closeFn = this.closeFn.bind(this);
    this.sureFn = this.sureFn.bind(this);
    this.changeValFn = this.changeValFn.bind(this);
  }
  private openFn() {
    this.setState({
      openFlag: true
    });
  }
  private closeFn() {
    this.setState({
      openFlag: false
    });
  }
  private changeValFn(val) {
    this.setState({
      inputVal: val
    });
  }
  private async sureFn(): Promise<void> {
    if (!this.state.inputVal) {
      message.warning('内容不能为空');
      return;
    }
    const query = {
      sku_id: this.props.info.id,
      field: this.props.name,
      value: this.state.inputVal * 100
    };
    await serve.goodsSingle(query);
    message.success('修改成功');
    this.setState({
      openFlag: false,
      initVal: this.state.inputVal
    });
  }
  render () {
    if (this.state.openFlag) { // 编辑状态
      return (
        <div className="flex flex-aic">
          <InputNumber defaultValue={this.state.inputVal} placeholder="请输入" width={150} onChange={this.changeValFn}></InputNumber>
          <CheckCircleOutlined onClick={this.sureFn} className="ml5" style={{'color':'#EE4C47','cursor': 'pointer'}}/>
          <CloseCircleOutlined onClick={this.closeFn} className="ml5" style={{'color':'#EE4C47','cursor': 'pointer'}}/>
        </div>
      );
    } else {
      return (
        <div className="flex flex-aic">
          {/* <p>{this.props.info[this.props.name] / 100}</p> */}
          <p>{this.state.initVal}</p>
          <EditOutlined className="ml5" style={{'color':'#EE4C47'}} onClick={this.openFn}/>
        </div>
      );
    }
  }
}