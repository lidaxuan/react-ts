/*
 * @Description: 
 * @Author: 李继玄（15201002062@163.com）
 * @Date: 2021-01-22 14:31:24
 * @FilePath: /react-ts-antvg6/src/pages/antv/index.tsx
 */
/**
 * @file 商品管理
 * @author svon.me@gmail.com
 */

import _ from 'lodash';
import React from 'react';
import G6 from "@antv/g6";
import { initBehavors } from "../../behavior";
import '../../styles/antv/antv.scss';
import CreateEditor from '../../customantv/createEditor';
import { getData } from '../../model/editor';


interface GoodsProps {
  [key: string]: any;
}
interface Goods {
  graph: any;
  editorClass: any;
  editTbaleIndex: number,
  [key: string]: any;
}

export default abstract class Antv<Props extends GoodsProps, State extends Goods> extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = this.stateInit();
    this.init = this.init.bind(this);
  }
  stateInit() {
    const state = {
      graph: '',
      editorClass: '',
    };
    return state as State;
  }

  componentDidMount() {
    initBehavors();
    setTimeout(() => {
      this.init();
    }, 1000);
    // todo
  }

  componentWillUnmount(): void {
    // todo
  }
  init() {
    const res = getData();
    // 实例化 Grid 插件
    const editorClass = new CreateEditor(res);
    editorClass.registerNodeFn();
    editorClass.registerEdgeFn();
    setTimeout(() => {
      const graph = editorClass.init();
      this.setState({
        graph,editorClass
      });
    }, 100);
  }
  /** 添加类目 ---------------------------- */
  render(): React.ReactElement {
    return (
      <div className="antv">
        <div>123</div>
        <div id="container"></div>
      </div>);
  }
}