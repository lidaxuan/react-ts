
import React, { Component } from 'react';
import Image from '../images/index';
import { Slider, Input } from 'antd';


// 定义组建内部需要使用到的数据
// 使用 Class 来定义 State 数据结构的优势在于可以定义默认值
// 如果使用 interface 来定义，则只能定义类型，不能定义默认值
// 此技巧在处理 Component 的 state 有效果，不能用于 Props
class State {
  width?: number = 100;
  height?: number = 100;
  text?: string;
}
interface LabelOptions {
  color: string;
}
/**
 * Component 类有两个范型 Props & State
 * Props: 组建外部传入的数据
 * State: 组建内部自行维护的数据
 * 此处不需要外部传入任何数据，则不进行定义，props 填写 any (默认为空) 即可
 */
export default class Demo1 extends Component<any, State> {
  constructor(props: any) {
    // 执行父类构造方法
    super(props); // 此行代码必须放在首行

    // 实列化 State 对象得到默认数据
    this.state = new State();
    // 修改 onChangeWidth 方法的指针
    // 因为在下面 onChange={ this.onChangeWidth } 中使用时，该方法的指针会发生变化
    // 使用 .bind 方法可保证指针不会发生变化
    this.onChangeWidth = this.onChangeWidth.bind(this);
    this.onChangeHeight = this.onChangeHeight.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.labelFn = this.labelFn.bind(this);
  }
  componentDidMount() {
    const optionVal = {
      color: 'red',
      num: 1,
      aa: 'www'
    } as LabelOptions;
    this.labelFn(optionVal);
    
  }
  private labelFn(value: LabelOptions) {
    console.log(value);
  }
  // 改变宽度
  private onChangeWidth(width: number): void {
    // 修改宽度数据
    this.setState({ width });
  }
  private onChangeHeight(height: number): void {
    // 修改高度数据
    this.setState({ height });
  }
  private onChangeText(e: any): void {
    const target: HTMLInputElement = e.target;
    if (target) {
      const text: string = target.value;
      this.setState({ text });
    }
  }
  render(): React.ReactElement {
    const state: State = this.state;
    return (<div style={{ width: '300px', padding: '10px' }}>
      <div>
        <Image width={state.width} height={state.height} text={state.text}></Image>
      </div>
      <div>
        <p>图片宽度: {state.width}px</p>
        <Slider defaultValue={state.width} min={30} max={300} onChange={this.onChangeWidth} />
      </div>
      <div>
        <p>图片高度: {state.height}px</p>
        <Slider defaultValue={state.height} min={30} max={300} onChange={this.onChangeHeight} />
      </div>
      <div>
        <p>图片内容: {state.text}</p>
        <Input value={state.text} onChange={this.onChangeText} />
      </div>
    </div>);
  }
}

