/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-08-13 14:32:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-22 17:47:04
 * @FilePath: /react-ts-antvg6/src/behavior/hover-node.js
 */

import transferObj from '../transfer';

export default {
  getEvents() {
    return {
      'node:mouseenter': 'onMouseover',
      'node:mouseleave': 'onMouseleave',
      "node:mousedown": "onMousedown"
    };
  },
  onMouseover(e) {
    console.log(111);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const item = e.item;
    const graph = self.graph;
    const group = item.getContainer();
    if (e.target._attrs.isOutPointOut || e.target._attrs.isOutPoint) {
      group.find(g => {
        if (g._attrs.isInPoint || g._attrs.isOutPoint) {
          g.attr("fill", "#fff");
        }
        if (g._attrs.isOutPoint) {
          if (g._attrs.id === e.target._attrs.parent) {
            group.find(gr => {
              if (gr._attrs.id === g._attrs.id) {
                gr.attr('fill', "#1890ff");
                gr.attr('opacity', 1);
              }
            });
          }
          if (g._attrs.id === e.target._attrs.id) {
            g.attr("fill", "#1890ff");
            g.attr('opacity', 1);
          }

        }
      });
      e.target.attr("cursor", "crosshair");
      this.graph.paint();
    }
    if (item.hasState('selected')) {
      return;
    } else {
      if (self.shouldUpdate.call(self, e)) {
        graph.setItemState(item, 'hover', true);
      }
    }
    graph.paint();
    transferObj.transferMouseover(e);
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
    transferObj.transferMouseleave(e);
  },
  onMousedown(e) {
    if (e.target._attrs.isOutPoint || e.target._attrs.isOutPointOut) {
      this.graph.setMode('addEdge');
    } else {
      this.graph.setMode('moveNode');
    }
  },

};
