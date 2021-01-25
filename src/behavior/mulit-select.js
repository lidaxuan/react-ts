/* jshint esversion: 6 */
/*
 * @Description: 
 * @Author: 李继玄（15201002062@163.com）
 * @Date: 2021-01-22 16:57:13
 * @FilePath: /react-ts-antvg6/src/behavior/mulit-select.js
 */
// import Util from '@antv/g6/src/util';
import { uniqueId, getBox } from '../utils';
import config from '../command/global';
import transferObj from '../transfer';
import _ from 'lodash';

let nodesId = [];
export default {
  getDefaultCfg() {
    return {
    };
  },
  getEvents() {
    return {
      'canvas:mouseenter': 'onCanvasMouseenter',
      'canvas:mousedown': 'onCanvasMousedown',
      mousemove: 'onMousemove',
      mouseup: 'onMouseup'
    };
  },
  onCanvasMouseenter() {
    const canvas = document.getElementById('graph-container').children[0];
    canvas.style.cursor = 'crosshair';
  },

  onCanvasMousedown(e) {
    const attrs = config.delegateStyle;
    const width = 0, height = 0, x = e.x, y = e.y;
    const parent = this.graph.get('group');
    this.shape = parent.addShape('rect', {
      attrs: {
        id: 'rect' + uniqueId(),
        width,
        height,
        x,
        y,
        ...attrs
      }
    });
  },
  onMousemove(e) {
    if (this.shape) {
      const width = e.x - this.shape._attrs.x;
      const height = e.y - this.shape._attrs.y;
      this.shape.attr({
        width,
        height
      });
      this.graph.paint();
    }
  },
  onMouseup() {
    const canvas = document.getElementById('graph-container').children[0];
    canvas.style.cursor = 'default';
    const selected = this.graph.findAllByState('node', 'selected');
    console.log('selected', selected);
    
    /* Util.each(selected, node => {
      this.graph.setItemState(node, 'selected', false);
    }); */
    _.each(selected, node => {
      this.graph.setItemState(node, 'selected', false);
    });
    
    if (this.shape) {
      nodesId = this.addTeam();
      this.shape.remove();
      this.shape = null;
    }
    this.graph.paint();
    transferObj.transferMuliteSelectEnd(nodesId);
    this.graph.setMode('default');
  },
  addTeam() {
    nodesId = [];
    const { x, y, width, height } = this.shape._attrs;
    const { x1, y1, x2, y2 } = getBox(x, y, width, height);
    this.graph.findAll('node', node => {
      const { x: nodeX, y: nodeY, width: nodeWidth, height: nodeHeight } = node.getBBox();
      const nodeBox = getBox(nodeX, nodeY, nodeWidth, nodeHeight);
      if ((x2 >= nodeBox.x1 && nodeBox.x1 >= x1) &&
        (x2 >= nodeBox.x2 && nodeBox.x2 >= x1) &&
        (y2 >= nodeBox.y1 && nodeBox.y1 >= y1) &&
        (y2 >= nodeBox.y2 && nodeBox.y2 >= y1)) {
        this.graph.setItemState(node, 'selected', 'health');
        nodesId.push(node._cfg.id);
      }
    });
    return nodesId;

  },
};
