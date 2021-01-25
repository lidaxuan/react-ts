/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-10-13 16:43:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-22 18:01:13
 * @FilePath: /react-ts-antvg6/src/command/formatNodeXY.js
 */
/**
 * x----300
 * y---- 50
 */
import { loadStore } from './storage.js';
// import { Message } from 'element-ui';
import _ from 'lodash';
import DB from '@fengqiaogang/dblist';
import * as util from './util';

export default class FormatNode {
  constructor(graph) {
    this.graph = graph;
    this.data = loadStore().nodes;
    this.db = new DB('asd', this.data, 'id', 'pid');
  }
  start() {
    const db = this.db;

    let x = 500;
    let y = 70;
    let currentLevelNode = this.getCurrentNodeList({nodeType: 'MEDIA'});
    currentLevelNode.forEach((media, i) => {
      if (i === 0) {
        media.x = x;
        media.y = y;
      }
      if (i !== 0) {
        media.x = x;
        media.y = y;
      }
      x += 200;
      y += 0;
    });
    x -= 200;
    
    
    let parentNode = currentLevelNode;
    let centerX = (_.last(parentNode).x - _.first(parentNode).x) / 2 + _.first(parentNode).x;
    currentLevelNode = this.getCurrentNodeList({pid: _.map(currentLevelNode, item => item.id)});
    
    let centerIndex;
    if (currentLevelNode.length % 2 === 1) {
      centerIndex = (currentLevelNode.length - 1) / 2;
    }
    y += 150;
    currentLevelNode[centerIndex].x = centerX;
    currentLevelNode[centerIndex].y = y;



    y += 150;
    parentNode = currentLevelNode;
    centerX = (_.last(parentNode).x - _.first(parentNode).x) / 2 + _.first(parentNode).x;
    currentLevelNode = this.getCurrentNodeList({pid: _.map(currentLevelNode, item => item.id)});
    if (currentLevelNode.length % 2 === 1) {
      centerIndex = (currentLevelNode.length - 1) / 2;
      for (let i = centerIndex; i >= 0; i--) {
        if (parentNode.length % 2 === 1) {
          if (i === centerIndex) {
            x -= 200 / 2;
          } else {
            x -= 200;
          }
        } else {
          x -= 200;
        }
        console.log(x);
        currentLevelNode[i].x = x;
        currentLevelNode[i].y = y;
      }
    } else {
      centerIndex = currentLevelNode.length / 2 - 1;
      for (let i = centerIndex; i >= 0; i--) {
        if (parentNode.length % 2 === 1) {
          if (i === centerIndex) {
            x -= 200 ;
          } else {
            x -= 200;
          }
        } else {
          x -= 200;
        }
        console.log(x);
        currentLevelNode[i].x = x;
        currentLevelNode[i].y = y;
      }
    }
    x = currentLevelNode[centerIndex].x;
    for (let i = centerIndex + 1; i < currentLevelNode.length; i++) {
      x += 200;
      currentLevelNode[i].x = x;
      currentLevelNode[i].y = y;
    }
    y += 150;
    parentNode = currentLevelNode;
    centerX = (_.last(parentNode).x - _.first(parentNode).x) / 2 + _.first(parentNode).x;
    currentLevelNode = this.getCurrentNodeList({pid: _.map(currentLevelNode, item => item.id)});
    if (currentLevelNode.length % 2 === 1) {
      centerIndex = (currentLevelNode.length - 1) / 2;
      for (let i = centerIndex; i >= 0; i--) {
        if (parentNode.length % 2 === 1) {
          if (i === centerIndex) {
            x -= 200 / 2;
          } else {
            x -= 200;
          }
        } else {
          x -= 200;
        }
        console.log(x);
        currentLevelNode[i].x = x;
        currentLevelNode[i].y = y;
      }
    } else {
      centerIndex = currentLevelNode.length / 2 - 1;
      for (let i = centerIndex; i >= 0; i--) {
        if (parentNode.length % 2 === 1) {
          if (i === centerIndex) {
            x -= 200 ;
          } else {
            x -= 200;
          }
        } else {
          x -= 200;
        }
        console.log(x);
        currentLevelNode[i].x = x;
        currentLevelNode[i].y = y;
      }
    }
    x = currentLevelNode[centerIndex].x;
    for (let i = centerIndex + 1; i < currentLevelNode.length; i++) {
      x += 200;
      currentLevelNode[i].x = x;
      currentLevelNode[i].y = y;
    }
    y += 150;
    parentNode = currentLevelNode;
    centerX = (_.last(parentNode).x - _.first(parentNode).x) / 2 + _.first(parentNode).x;
    currentLevelNode = this.getCurrentNodeList({pid: _.map(currentLevelNode, item => item.id)});
    if (currentLevelNode.length % 2 === 1) {
      centerIndex = (currentLevelNode.length - 1) / 2;
      for (let i = centerIndex; i >= 0; i--) {
        if (parentNode.length % 2 === 1) {
          if (i === centerIndex) {
            x -= 200 / 2;
          } else {
            x -= 200;
          }
        } else {
          x -= 200;
        }
        console.log(x);
        currentLevelNode[i].x = x;
        currentLevelNode[i].y = y;
      }
    } else {
      centerIndex = currentLevelNode.length / 2 - 1;
      for (let i = centerIndex; i >= 0; i--) {
        if (parentNode.length % 2 === 1) {
          if (i === centerIndex) {
            x -= 200 ;
          } else {
            x -= 200;
          }
        } else {
          x -= 200;
        }
        console.log(x);
        currentLevelNode[i].x = x;
        currentLevelNode[i].y = y;
      }
    }
    x = currentLevelNode[centerIndex].x;
    for (let i = centerIndex + 1; i < currentLevelNode.length; i++) {
      x += 200;
      currentLevelNode[i].x = x;
      currentLevelNode[i].y = y;
    }


    let list = db.clone();
    list.forEach(node => {
      if (node.nodeType === 'FORK') {
        node.name = util.forkAddName(node.id);
      }
    });
    this.updetaNode(list);
  }
  getCurrentNodeList(where) {
    const db = this.db;
    return db.select(where);
  }
  updetaNode(nodes) {
    nodes.forEach(node => {
      this.graph.update(node.id,node);
    });
  }
}