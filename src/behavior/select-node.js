/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-08-13 14:32:26
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-08 15:29:41
 * @FilePath: /decision-web/src/behavior/select-node.js
 */
// import Util from '@antv/g6/src/util';
// import eventBus from "../utils/eventBus";
// import { loadStorage } from '../utils/cache';
import {getNodeById, updateData, creatEdges, forkAddName} from '../command/util';
import DBList from '@fengqiaogang/dblist';
import transferObj from '../transfer';
import safeGet from '@fengqiaogang/safe-get';
import {loadStore, saveStore} from '../command/storage.js';

const DB =  class extends DBList {  
  childrenDeep (where, isSlice = false, limit) {
    const result = super.childrenDeep(where, limit);
    if (result && result.length > 1) {
      if (isSlice) {
        return result.slice(1);
      } else {
        return result;
      }
    }
    return [];
  }
};

function changeStatus(that, e) {
  let currentItem = getNodeById(e.item.getModel().id);
  const thatGraph = that.graph;
  /** start 更新当前节点以及所有同级状态为一样 */
  currentItem.isCollapseShape = currentItem.isCollapseShape ? false : true; // 先判断自身是否为展开
  updateData(currentItem);
  thatGraph.update(e.item, currentItem);// 更新当前节点
  let dataAll = loadStore();
  const dbList = new DB('db list', dataAll.nodes, 'id', 'pid');
  
  // 拿到pid是当前节点id 的 数据 也就是当前节点的子级
  let childArr = dbList.select({pid: currentItem.id});
  let pidArr = [];
  childArr.forEach(ele => { // 把所有子级的pid拿出来 这样就有当前节点的所有同级
    pidArr = pidArr.concat(ele.pid ? ele.pid : []);
  });
  
  let peerList = [];
  pidArr.forEach(ele => {
    peerList = peerList.concat(dbList.select({id: ele}));
  });
  // let peerList = dbList.select({id: pidArr}); // 查找所有同级节点
  console.log('peerList', peerList);
  peerList.forEach(ele => { // 把同级节点修改为当前节点状态
    ele.isCollapseShape = currentItem.isCollapseShape;
  });
  for (let i = 0; i < dataAll.nodes.length; i++) { // 替换原数据
    for (let j = 0; j < peerList.length; j++) {
      if (dataAll.nodes[i].id === peerList[j].id) {
        dataAll.nodes[i] = peerList[j];
      }
    }
  }
  console.log('dataAll', dataAll);
  
  updateData(dataAll.nodes);
  peerList.forEach(ele => {
    thatGraph.update(ele.id, ele);// 更新当前节点
  });
  /** end 更新当前节点以及所有同级状态为一样 */
  
  let initData = loadStore();
  const db = new DB('db list', initData.nodes, 'id', 'pid');
  let childrenDeepList = db.childrenDeep({ id: currentItem.id }); // 查找当前所有子集
  let child = [];
  if (currentItem.isCollapseShape === false) { // 如果点击的当前节点是收起 默认所有子节点隐藏
    childrenDeepList.forEach((ele, index) => {
      if (index === 0) {
        return;
      }
      ele.showFlag = false;
    });
  } else if (currentItem.isCollapseShape === true) { // 当前节点是展开
    childrenDeepList.forEach( async (ele, index) => { // 所有子集便利
      if (index === 0) {
        return;
      }
      ele.showFlag = true; // 先将所有进行展示
      if (ele.isCollapseShape === false) { // 谁的节点是收起状态
        let cld = db.childrenDeep({ id: ele.id }, true);
        // cld.shift();
        child = child.concat(cld); // 
      }
    });
    if (child) {
      child.forEach(element => {
        element.showFlag = false;
      });
    }
  }
  if (child) {
    childrenDeepList.forEach((ele, index) => {
      child.forEach(element => {
        if (ele.id === element.id) {
          childrenDeepList[index] = element;
        }
      });
    });  
  }
  initData.nodes.forEach((ele, index) => {
    childrenDeepList.forEach(element => {
      if (ele.id === element.id) {
        initData.nodes[index] = element;
      }
    });
  });
  saveStore(initData);
  setTimeout(() => {
    let arr = [];
    childrenDeepList.forEach(ele =>{
      const node = thatGraph.findById(ele.id);
      if (ele.nodeType === 'FORK') {
        ele.name = forkAddName(ele.id);
      }
      if (ele.showFlag === false) { // 隐藏
        node.hide();
        thatGraph.hideItem(node);
      } else { // true 显示
        arr.push(ele);
        thatGraph.update(ele.id, ele);
        node.show();
        thatGraph.showItem(node);
      }
    });
    if (arr ) {
      arr.splice(0, 1);
      let edges = creatEdges(arr);
      edges.forEach(ele => {
        thatGraph.add('edge', ele);
      });
    }
  }, 0);
}


const content = ['-', '+'];

export default {
  getDefaultCfg() {
    return {
      multiple: true,
      keyCode: 16
    };
  },
  getEvents() {
    return {
      'node:click': 'onClick',
      'canvas:click': 'onCanvasClick',
      'canvas:mouseover': 'onCanvasMouseover',
      keyup: 'onKeyUp',
      keydown: 'onKeyDown'
    };
  },
  async onClick(e) {
    const item = e.item;
    /*  */
    const attr = e.target._attrs;
    if (!!attr.text && content.indexOf(attr.text) !== -1) {
      changeStatus(this, e);
    } else if (!!attr.type && attr.type === "desition_info") {
      const id = safeGet(e, 'item._cfg.id');
      const node = getNodeById(id);
      const detailId = safeGet(node, 'detailData.detailId');
      window.open(`${window.location.origin}/aggregate?detailId=${detailId}`);
    } else {
      transferObj.transferClickNodeEmitNodeId(item);
    }
  },
  onCanvasClick() {
    transferObj.transferClickNodeEmitNodeId();
  },
  onCanvasMouseover() {
    const graph = this.graph;
    graph.paint();
  },
  onKeyDown(e) {
    const code = e.keyCode || e.which;
    if (code === this.keyCode) {
      this.keydown = true;
    } else {
      this.keydown = false;
    }
  },
  onKeyUp() {
    this.keydown = false;
  }
};
