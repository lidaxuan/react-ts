/* jshint esversion: 6 */
/*
 * @Description: 
 * @Author: 李继玄（15201002062@163.com）
 * @Date: 2021-01-22 16:57:13
 * @FilePath: /react-ts-antvg6/src/behavior/hover-edge.js
 */

import {Util} from '@antv/g6';
// import transferObj from '../transfer';

export default {
  getEvents() {
    return {
      'edge:mouseover': 'onMouseover',
      'edge:mouseleave': 'onMouseleave',
      "edge:click": "onClick",
    };
  },
  onMouseover(e) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const item = e.item;
    const graph = self.graph;
    if (item.hasState('selected')) {
      return;
    } else {
      if (self.shouldUpdate.call(self, e)) {
        graph.setItemState(item, 'hover', true);
      }
    }
    graph.paint();
  },
  onMouseleave(e) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const item = e.item;
    const graph = self.graph;
    const group = item.getContainer();
    group.find(g => {
      if (g._attrs.isInPoint || g._attrs.isOutPoint) {
        g.attr("fill", "#fff");
      }
    });
    if (self.shouldUpdate.call(self, e)) {
      if (!item.hasState('selected'))
        graph.setItemState(item, 'hover', false);
    }
    graph.paint();
  },
  onClick(e) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const item = e.item;
    const graph = self.graph;
    const autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);
    const selectedNodes = graph.findAllByState('node', 'selected');
    console.log(selectedNodes);
    
    Util.each(selectedNodes, node => {
      graph.setItemState(node, 'selected', false);
    });
    if (!self.keydown || !self.multiple) {
      const selected = graph.findAllByState('edge', 'selected');
      Util.each(selected, edge => {
        if (edge !== item) {
          graph.setItemState(edge, 'selected', false);
        }
      });
    }
    let obj = {};
    if (item.hasState('selected')) {
      if (self.shouldUpdate.call(self, e)) {
        graph.setItemState(item, 'selected', false);
      }
      obj.target = item;
      obj.select = false;
    } else {
      if (self.shouldUpdate.call(self, e)) {
        graph.setItemState(item, 'selected', true);
      }
      
      obj.target = item;
      obj.select = true;
    }
    graph.setAutoPaint(autoPaint);
    graph.paint();
  },

};
