
/**
 * x----300
 * y---- 50
 */
import { loadStore } from '@/command/storage.js';
// import { Message } from 'element-ui';
import _ from 'lodash';
import DB from '@fengqiaogang/dblist';
import * as util from '@/command/util';

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
    this.newdb = void 0;
  }
  start() {
    const db = this.db;
    let space = this.space;

    const levelNodeArr = this.getArr({ nodeType: ['MEDIA', 'SHAREMEDIA'] }) || [];
    // y
    for (let i = 0; i < levelNodeArr.length; i++) {
      for (let k = 0, line = levelNodeArr[i]; k < line.length; k++) {
        levelNodeArr[i][k].y = this.y;
      }
      this.y += 150;
    }
    // y
    const second = levelNodeArr.splice(0, 2);
    let newNodeArray = _.flattenDeep(second); // 新数组 放节点
    
    // 第三层
    let result = _.sortBy(levelNodeArr[0], item => { // 第三层进行排序
      item.nameClone = _.cloneDeep(item.form.forkNumber);
      return (item.nameClone.charCodeAt() - 0);//根据code对数据进行升序排序，如果降序则改为：return -item.code
    });
    newNodeArray = [].concat(newNodeArray, ...result); // 第三层放入新数组
    
    // 第四层
    let four = [];
    result.forEach(item => {
      let itemChild = db.select({pid: item.id});
      four = [].concat(four, itemChild);
    });
    newNodeArray = [].concat(newNodeArray, four);
    levelNodeArr.splice(0, 1);

    // 第五层
    let forksort = [];
    levelNodeArr[0].forEach(item => {
      let itemChild = db.select({pid: item.id});
      let result = _.sortBy(itemChild, item => { // 
        item.nameClone = _.cloneDeep(item.form.forkNumber);
        return item.nameClone.charCodeAt();//根据code对数据进行升序排序，如果降序则改为：return -item.code
      });
      forksort = [].concat(forksort, ...result);
    });
    newNodeArray = [].concat(newNodeArray, ...forksort);
    levelNodeArr.splice(0, 1);
    
    // 第六层  第六层排序需要第五次排序后的数据
    let nodesort = [];
    forksort.forEach(item => {
      const node = db.select({pid: item.id});
      nodesort = [].concat(nodesort, node);
    });
    newNodeArray = [].concat(newNodeArray, nodesort);
    levelNodeArr.splice(0, 1);

    // 第七层
    forksort = [];
    nodesort.forEach(item => {
      let itemChild = db.select({pid: item.id});
      let result = _.sortBy(itemChild, item => { // 
        item.nameClone = _.cloneDeep(item.form.forkNumber);
        return item.nameClone.charCodeAt();//根据code对数据进行升序排序，如果降序则改为：return -item.code
      });
      forksort = [].concat(forksort, ...result);
    });
    newNodeArray = [].concat(newNodeArray, ...forksort);
    levelNodeArr.splice(0, 1);


    // 第八层
    nodesort = [];
    forksort.forEach(item => {
      const node = db.select({pid: item.id});
      nodesort = [].concat(nodesort, node);
    });
    newNodeArray = [].concat(newNodeArray, nodesort);
    levelNodeArr.splice(0, 1);






    this.newdb = new DB('newNodeArray', newNodeArray, 'id', 'pid');
    let orderNodes = this.newdb.select({ nodeType: 'ORDER' });
    let orderW = 150;
    const { x } = _.first(orderNodes);
    orderNodes.forEach((node, index) => {
      if (index) { // 变避免每次递增
        node.x = x + orderW;
        orderW += 150;
      }
    });
    const levelNodeArrNew = this.getArr111({ nodeType: ['MEDIA', 'SHAREMEDIA'] }) || [];
    console.log(this.newdb.clone());
    console.log(levelNodeArrNew);
    for (let i = levelNodeArrNew.length - 1; i >= 0; i--) {
      if (i >= 1) {
        const pid = levelNodeArrNew[i].map(item => {
          console.log(item);
          return item.pid;
        });
        console.log('======');
        let parent = db.select({ id: pid.flat() });
        parent.forEach((node) => {
          let child = db.select({ pid: node.id });
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

    let list = this.newdb.clone();
    // list.forEach(node => {
    //   if (node.nodeType === 'FORK') {
    //     node.name = util.forkAddName(node.id);
    //   }
    // });
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

  getArr(where, db) {
    let levelNodes = this.getCurrentLineNodeList(where, db);
    if (levelNodes && levelNodes.length) {
      this.outArr.push(levelNodes);
      this.getArr({ pid: _.map(levelNodes, item => item.id) }, db);
    }
    this.num = this.num + 1;
    return this.outArr;
  }

  getCurrentLineNodeList(where, db = this.db) {
    return db.select(where);
  }


  getArr111(where) {
    let levelNodes = this.getCurrentLineNodeList1111(where);
    console.log(levelNodes);
    if (levelNodes && levelNodes.length) {
      this.outArr.push(levelNodes);
      this.getArr111({ pid: _.map(levelNodes, item => item.id) });
    }
    this.num = this.num + 1;
    return this.outArr;
  }
  getCurrentLineNodeList1111(where) {
    console.log(where);
    return this.newdb.select(where);
  }
  updetaNode(nodes) {
    nodes.forEach(node => {
      // console.log('node.y %s', node.y);
      if (node.showFlag) {
        this.graph.update(node.id, node);
      }
    });
    // util.updateData(nodes);
  }
}