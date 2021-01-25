/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-10-13 16:43:11
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-12-03 15:11:33
 * @FilePath: /decision-web/src/command/formatNodeXYCopyCopy.js
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
    this.upNum = 0;
    this.outArr = [];
    this.db = new DB('asd', this.data, 'id', 'pid');
    this.x = 80,
    this.y = 80;
    this.space = 150;
  }
  start() {
    const db = this.db;
    let space = this.space;
    
    const levelNodeArr = this.getArr({nodeType: ['MEDIA','SHAREMEDIA']}) || [];
    var maxLength = Math.max(...levelNodeArr.map(item=>item.length));

    const maxIndex = levelNodeArr.findIndex(item => item.length === maxLength) || 1; // 0  获取哪一级节点多 获取索引
    console.log(maxIndex);
    if (levelNodeArr[maxIndex]) {
      levelNodeArr[maxIndex].forEach(node => { // 当前级 节点 x y 进行排版
        this.x = this.x + this.space;
        node.x = this.x;
      });
    }
    
    
    let centerLineIndex;
    let centerX;
    if (levelNodeArr[maxIndex].length % 2 === 1) { // 单数
      centerLineIndex = parseInt((levelNodeArr[maxIndex].length - 1) / 2);
      centerX = _.cloneDeep(levelNodeArr[maxIndex][centerLineIndex].x);
    } else { // 双数
      centerLineIndex = (levelNodeArr[maxIndex].length / 2) - 1;
      centerX = _.cloneDeep(levelNodeArr[maxIndex][centerLineIndex].x + (space / 2));
    }

    /** 第一行 流量节点 */
    let firstNodeArr = _.first(levelNodeArr);
    let centerObj = this.getCenterObj(firstNodeArr);
    if (centerObj.isEven) { // 双数
      this.evenNodes(firstNodeArr, centerX);
    } else { // 单数
      this.oddNodes(firstNodeArr, centerX);
    }

    /** 第二行 */
    this.y += 150;
    this.oddNodes(levelNodeArr[1], centerX, this.y);
    
    this.y += 150;

    /** 第三行 可有可无 */
    centerObj = this.getCenterObj(levelNodeArr[2] ? levelNodeArr[2] : []) || {};
    if (centerObj.isEven) { // 双数
      this.evenNodes(levelNodeArr[2] ? levelNodeArr[2] : [], centerX);
    } else { // 单数
      this.oddNodes(levelNodeArr[2] ? levelNodeArr[2] : [], centerX);
    }

    /** 循环 */

    for (let i = 2; i < levelNodeArr.length; i++) {
      let w = 150;
      console.log('levelNodeArr[i]', levelNodeArr[i]);
      for (let k = 0, line = levelNodeArr[i]; k < line.length; k++) {
        let childNodes = db.select({pid: line[k].id});
        if (childNodes.length >= 2) {
          childNodes.forEach(() => {
            w += 150;
          });
          levelNodeArr[i][k].x = line[k].x + (w / 2);
        }
        console.log('this.y', this.y);
        levelNodeArr[i][k].y = this.y;
        // ===============================================================
        w = 150;
        if (this.getIsEven(childNodes)) { // 双数
          this.evenNodes(childNodes, line[k].x, this.y);
        } else { // 单数
          this.oddNodes(childNodes, line[k].x, this.y);
        }
        // ===============================================================
      }
      this.y += 150;
    }

    
    for (let i = levelNodeArr.length - 1; i >= 0; i--) {
      // console.log(levelNodeArr[i]);
      if (i >= 1) {
        let pids = [];
        levelNodeArr[i].forEach(node => {
          pids = [].concat(pids, node.pid);
        });
        let parent = db.select({id: pids});
        parent.forEach((node) => {
          let child = db.select({pid: node.id});
          if (this.getIsEven(child)) { // 双数
            let center = child.length / 2 - 1;
            let diff = child[center + 1].x - child[center].x;
            node.x = child[center + 1].x - diff / 2;
          } else { // 单数
            let center = (child.length - 1) / 2;
            node.x = child[center].x;
          }
        });
      }
    }

    
    centerObj = this.getCenterObj(levelNodeArr[0]);
    if (centerObj.isEven) { // 双数
      this.evenNodes(levelNodeArr[0], levelNodeArr[1][0].x, 80);
    } else { // 单数
      this.oddNodes(levelNodeArr[0], levelNodeArr[1][0].x, 80);
    }
    

    let list = db.clone();
    list.forEach(node => {
      if (node.nodeType === 'FORK') {
        node.name = util.forkAddName(node.id);
      }
    });
    this.updetaNode(list);
  }
  evenNodes(nodes, centerX, y = this.y) {
    let centerIndex = nodes.length / 2 - 1;
    // 中心线往左
    for (let i = centerIndex; i >= 0; i--) {
      let x;
      if (nodes.length === 1) {
        x = centerX;
      } else {
        x = centerX - this.space * i - 75;
      }
      nodes[i].x = x;
      nodes[i].y = y;
    }
    let num = 0;
    for (let i = centerIndex + 1; i < nodes.length; i++) {
      let x = centerX + this.space * num + 75;
      nodes[i].x = x;
      nodes[i].y = y;
      num += 1;
    }
    return nodes;
  }
  oddNodes(nodes, centerX, y = this.y) {
    let centerIndex = (nodes.length - 1) / 2;
    // 中心线往左
    let num = 0;
    for (let i = centerIndex; i >= 0; i--) {
      let x;
      if (nodes.length === 1) {
        x = centerX;
      } else {
        x = centerX - this.space * num;
      }
      nodes[i].x = x;
      nodes[i].y = y;
      num += 1;
    }
    let rightNum = 0;
    for (let i = centerIndex + 1; i < nodes.length; i++) {
      rightNum += 1;
      let x = centerX + this.space * rightNum;
      nodes[i].x = x;
      nodes[i].y = y;
    }
    return nodes;
  }
  getCenterObj(nodes) {
    let obj = {};
    if (nodes.length % 2 === 0) { // 双数
      obj.isEven = true;
      obj.centerIndex = nodes.length / 2 - 1;
    } else { // 单数
      obj.isEven = false;
      obj.centerIndex = (nodes.length - 1) / 2;
    }
    return obj;
  }
  getIsEven(nodes) {
    if (nodes.length % 2 === 0) { // 双数
      return true;
    } else { // 单数
      return false;
    }
  }

  getArr(where) {
    let levelNodes = this.getCurrentLineNodeList(where);
    if (levelNodes && levelNodes.length) {
      this.outArr.push(levelNodes);
      this.getArr({pid: _.map(levelNodes, item => item.id)});
    }
    this.num = this.num + 1;
    return this.outArr;
  }

  getCurrentLineNodeList(where) {
    return this.db.select(where);
  }
  updetaNode(nodes) {
    nodes.forEach(node => {
      this.graph.update(node.id,node);
    });
    util.updateData(nodes);
  }
}