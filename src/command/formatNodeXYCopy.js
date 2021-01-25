/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-10-13 16:43:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-22 18:01:34
 * @FilePath: /react-ts-antvg6/src/command/formatNodeXYCopy.js
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
    this.y = 0;
    this.space = 130;
  }
  start() {
    const db = this.db;
    let space = this.space;
    
    const levelNodeArr = this.getArr({nodeType: ['MEDIA','SHAREMEDIA']});
    var maxLength = Math.max(...levelNodeArr.map(item=>item.length));

    const maxIndex = levelNodeArr.findIndex(item => item.length === maxLength) || 1; // 0

    this.y = maxIndex * ((space / 2) + 150);
    levelNodeArr[maxIndex].forEach(node => {
      this.x = this.x + this.space;
      node.x = this.x;
      node.y = this.y;
    });

    let centerLineIndex;
    let centerX;
    if (levelNodeArr[maxIndex].length % 2 === 1) { // 单数
      centerLineIndex = parseInt((levelNodeArr[maxIndex].length - 1) / 2);
      console.log('单数');
      centerX = _.cloneDeep(levelNodeArr[maxIndex][centerLineIndex].x);
    } else { // 双数
      centerLineIndex = (levelNodeArr[maxIndex].length / 2) - 1;
      console.log('双数');
      centerX = _.cloneDeep(levelNodeArr[maxIndex][centerLineIndex].x + (space / 2));
    }
    let centerY = levelNodeArr[maxIndex][centerLineIndex].y;
    // 往上
    let yNumUp = 0;
    let upNum = 0;
    for (let j = maxIndex - 1; j >= 0; j--) { 
      yNumUp = yNumUp + 1;
      upNum = upNum + 1;
      let y = centerY - space * yNumUp;
      if (levelNodeArr[j].length % 2 === 1) {
        // for (let index = 0; index < levelNodeArr[j].length; index++) {
        let centerIndex = '';
        let currentLevelNode = levelNodeArr[j];
        if (levelNodeArr[j].length % 2 === 0) { // 双数
          centerIndex = levelNodeArr[j].length / 2 - 1;
          // 中心线往左
          for (let i = centerIndex; i >= 0; i--) {
            let x = centerX - space * upNum;
            currentLevelNode[i].x = x;
            currentLevelNode[i].y = y;
          }
          for (let i = centerIndex + 1; i < levelNodeArr[j].length; i++) {
            let x = centerX + space * upNum;
            currentLevelNode[i].x = x;
            currentLevelNode[i].y = y;
          }
        } else { // 单数
          centerIndex = (levelNodeArr[j].length - 1) / 2;
          // 中心线往左
          for (let i = centerIndex; i >= 0; i--) {
            let x = centerX - space * i;
            currentLevelNode[i].x = x;
            currentLevelNode[i].y = y;
          }
          for (let i = centerIndex + 1; i < levelNodeArr[j].length; i++) {
            let x = centerX + space * upNum;
            currentLevelNode[i].x = x;
            currentLevelNode[i].y = y;
          }
        }
        // }
        upNum = 0;
      } else {// 双数
        for (let index = 0; index < levelNodeArr[j].length; index++) {
          let centerIndex = '';
          let currentLevelNode = levelNodeArr[j];
          if (levelNodeArr[j].length % 2 === 0) { // 双数
            centerIndex = levelNodeArr[j].length / 2 - 1;
            
            for (let i = centerIndex; i >= 0; i--) { // 中心线往左
              let x = centerX - space * upNum + (space / 2);
              currentLevelNode[i].x = x;
              currentLevelNode[i].y = y;
            }
            for (let i = centerIndex + 1; i < levelNodeArr[j].length; i++) { // 中心线往右
              let x = centerX + space * upNum - (space / 2);
              currentLevelNode[i].x = x;
              currentLevelNode[i].y = y;
            }
          } else { // 单数
            centerIndex = (levelNodeArr[j].length - 1) / 2;
            // 中心线往左
            for (let i = centerIndex; i >= 0; i--) {
              let x = centerX - space * i;
              currentLevelNode[i].x = x;
              currentLevelNode[i].y = y;
            }
            
          }
        }
        upNum = 0;
      }
    }
    // 向下
    let yNumDown = 0;
    let downNum = 0;
    for (let j = maxIndex + 1; j < levelNodeArr.length; j++) {
      yNumDown = yNumDown + 1;
      downNum = downNum + 1;
      let y = centerY + space * yNumDown;
      if (levelNodeArr[j].length % 2 === 1) {
        // for (let index = 0; index < levelNodeArr[j].length; index++) {
        let centerIndex = '';
        let currentLevelNode = levelNodeArr[j];
        if (levelNodeArr[j].length % 2 === 0) { // 双数
          centerIndex = levelNodeArr[j].length / 2 - 1;
          // 中心线往左
          for (let i = centerIndex; i >= 0; i--) {
            let x = centerX - space * downNum;
            currentLevelNode[i].x = x;
            currentLevelNode[i].y = y;
          }
          for (let i = centerIndex + 1; i < levelNodeArr[j].length; i++) {
            let x = centerX + space * downNum;
            currentLevelNode[i].x = x;
            currentLevelNode[i].y = y;
          }
        } else { // 单数
          centerIndex = ((levelNodeArr[j].length - 1) / 2) || 1;
          // 中心线往左
          let rightNum = 0;
          if (levelNodeArr[j].length === 1) {
            for (let i = centerIndex - 1; i >= 0; i--) {
              let x = centerX;
              currentLevelNode[i].x = x;
              currentLevelNode[i].y = y;
            }
          } else {
            for (let i = centerIndex - 1; i >= 0; i--) {
              rightNum = rightNum + 1;
              let x = centerX - space * rightNum;
              currentLevelNode[i].x = x;
              currentLevelNode[i].y = y;
            }
          }
          // 中心线向右
          for (let i = centerIndex; i < levelNodeArr[j].length; i++) {
            let x = centerX + space * i - space;
            currentLevelNode[i].x = x;
            currentLevelNode[i].y = y;
          }
        }
        // }
        downNum = 0;
      } else {// 双数

        for (let index = 0; index < levelNodeArr[j].length; index++) {
          let centerIndex = '';
          let currentLevelNode = levelNodeArr[j];
          if (levelNodeArr[j].length > 1 && levelNodeArr[j].length % 2 === 0) { // 双数

            centerIndex = levelNodeArr[j].length / 2 - 1;
            let leftNum = 0;
            for (let i = centerIndex; i >= 0; i--) { // 中心线往左
              leftNum = leftNum + 1;
              let x = i > 0 ? centerX - space * leftNum + (space / 2) : centerX - space * (centerIndex + 1) + (space / 2);
              currentLevelNode[i].x = x;
              currentLevelNode[i].y = y;
            }
            let rightNum = 0;
            for (let i = centerIndex + 1; i < levelNodeArr[j].length; i++) { // 中心线往右
              rightNum = rightNum + 1;
              let x = centerX + space * rightNum - (0 + (space / 2));

              currentLevelNode[i].x = x;
              currentLevelNode[i].y = y;
            }
          } else if (levelNodeArr[j].length % 2 === 0) {
            centerIndex = levelNodeArr[j].length / 2 - 1;
            for (let i = centerIndex; i >= 0; i--) { // 中心线往左
              let x = i > 0 ? centerX - space * downNum + (space / 2) : centerX - space * (centerIndex + 1) + (space / 2);
              currentLevelNode[i].x = x;
              currentLevelNode[i].y = y;
            }
            for (let i = centerIndex + 1; i < levelNodeArr[j].length; i++) { // 中心线往右
              let x = centerX + space * i - (0 + (space / 2));
              currentLevelNode[i].x = x;
              currentLevelNode[i].y = y;
            }
          } else { // 单数
            centerIndex = (levelNodeArr[j].length - 1) / 2;
            // 中心线往左
            for (let i = centerIndex; i >= 0; i--) {
              let x = centerX - space * i;
              currentLevelNode[i].x = x;
              currentLevelNode[i].y = y;
            }
            for (let i = centerIndex + 1; i < levelNodeArr[j].length; i++) {
              let x = centerX - space * downNum;
              currentLevelNode[i].x = x;
              currentLevelNode[i].y = y;
            }
            
          }
        }
        // downNum = 0;
      }
    }

    let list = db.clone();
    list.forEach(node => {
      if (node.nodeType === 'FORK') {
        node.name = util.forkAddName(node.id);
      }
    });
    this.updetaNode(list);
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
  }
}