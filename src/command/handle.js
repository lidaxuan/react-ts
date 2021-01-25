import { uniqueId } from '@/utils';
import DB from '@/utils/DB';
import _ from 'lodash';
// import { MessageBox, Message } from 'element-ui';
import {loadStore, saveStore} from '@/command/storage.js';
import * as util from '@/command/util';
import releaseNode from '@/assets/icons/control/fork.svg';
import baseNodeParme from '@/components/Base/forkNode';
import G6 from "@antv/g6/build/g6";
import Grid from "@antv/g6/build/grid";
import safeSet from '@fengqiaogang/safe-set';
// import safeGet from '@fengqiaogang/safe-get';
import transferObj from '@/transfer';


export default class GraphEditor {
  constructor(w, h) {
    this.id = uniqueId();
    this.w = w;
    this.h = h;
    this.graph = null;
  }
  initGraph() {
    this.graph = null;
    const grid = new Grid();
    this.graph = new G6.Graph({
      container: "graph-container",
      width: this.w,
      height: this.h,
      animate: true,
      animateCfg: {
        duration: 1000,
        easing: 'easeLinnear',
      },
      modes: {
        default: [// 支持的 behavior
          "drag-canvas",
          // "zoom-canvas",
          "hover-node",
          "select-node",
          "hover-edge",
          "keyboard",
          "customer-events",
          "add-menu",
        ],
        mulitSelect: ["mulit-select"],
        addEdge: ["add-edge"],
        moveNode: ["drag-item"]
      },
      plugins: [grid], // 配置 Grid 插件和 Minimap 插件
    });
    this.bindEvent();
    return this.graph;
  }
  // 添加 --- 复制  节点 走的一个逻辑
  addNode(item, type = 'add') {
    item.id = uniqueId();
    let delArr = ['id', 'secondNode', 'isDel'];
    if (item.nodeType !== 'MEDIA' && item.nodeType !== 'SHAREMEDIA') {
      delArr.push('pid');
    }
    item = _.omit(item, delArr);
    if (item.form && item.form.children) { // 如果是复制的话
      delete item.form.children; // 将面板需要的children 删除
    }
    item.id = uniqueId(); // 生成id
    let initData = loadStore();
    if (!util.canAddNode(item)) { 
      return;
    }
    if (type === 'copy') {
      item.x = item.x + 20;
      item.y = item.y + 20;
    }
    if (type === 'add') {
      if (item.nodeType === 'ORDER') {
        safeSet(item, 'form.status', 'CLOSE');
        safeSet(item, 'form.name', '投放节点');
      }
    }
    let nodes = initData.nodes || [];
    nodes.push(item);
    initData.nodes = nodes;
    saveStore(initData);
    this.graph.add(item.type, item);
  }
  // 移动节点更新数据
  moveNodeUpdata(item) {
    let model = item.item._cfg.model;
    let currentItem = util.getNodeById(model.id);
    // console.log('currentItem', currentItem);
    const moveX = item.newModel.x - item.oldModel.x; // 拿到节点移动的差值
    const moveY = item.newModel.y - item.oldModel.y; // 拿到节点移动的差值
    if (!currentItem.isCollapseShape) { // 当前节点是收起状态
      let db = new DB('select', loadStore().nodes, 'id', 'pid');
      let childArr = db.childrenDeep({id: currentItem.id}); // 拿到当前节点的素有子节点
      childArr.forEach(ele => { // 修改所有子节点的坐标
        ele.x = ele.x + moveX;
        ele.y = ele.y + moveY;
      });
      for (let i = 0; i < childArr.length; i++) {
        db.update({id: childArr[i].id}, {x: childArr[i].x, y: childArr[i].y}); // 更新所有子节点坐标数据
      }
      util.updateData(db.clone()); // 更新数据
      this.graph.update(currentItem.id, _.first(childArr)); // 更新视图
    } else { // 当前节点是展开状态
      currentItem.x = item.newModel.x;
      currentItem.y = item.newModel.y;
      util.updateData(currentItem);
      this.graph.update(currentItem.id, item.newModel);
    }
  }
  // 连线
  addEdgeItem(data) {
    /** 是否可以连线 */
    if (!util.canConnect(data.sourceId, data.targetId, this.graph)) {
      return;
    }
    const res = util.creatPid(data, true); // 生成pid
    const result = util.createChildren(data); // 父级生成children 是不是生成了 true false
    if (res) {
      this.graph.add(data.type, data);
      this.graph.update(data.sourceId, data.sourceId);
    }
    return result;
  }
  // 
  getNeedRemoveNode(data) {
    let nodes = loadStore().nodes || [];
    const db = new DB('db list', nodes, 'id', 'pid');
    const currentNode = db.selectOne({id: data.id});
    let childrenItem = db.select({ pid: data.id, nodeType: 'FORK' }) || [];
    childrenItem.unshift(currentNode);
    for (let i = 0; i < childrenItem.length; i++) {
      this.removeItem(childrenItem[i]);
    }
  }
  // 删除当前节点
  removeItem(item) {
    let initData = loadStore(); // 将数据拿出来
    const db = new DB('db list', initData.nodes, 'id', 'pid'); // 获取实例
    let childrenItem = null;
    // -----------  start 更新children中的pid -----------
    childrenItem = db.select({ pid: item.id }) || [];
    let currentNode = db.selectOne({id: item.id});
    let parentList = db.select({ id: currentNode.pid }); // 查找出来 删除节点的父级
    /** 将删除节点的子数据 的pid 进行删除 然后修改存储 */
    if (childrenItem && childrenItem.length) { // 如果查询出来 反之查询不出来 什么都不做
      childrenItem = childrenItem[0];
      _.pullAll(childrenItem.pid, [item.id]); 
      util.updateData(childrenItem); // 更新数据
    }
    // -----------  end  更新children中的pid -----------


    initData.nodes = initData.nodes.map(t => {
      return t.id === item.id ? false : t;
    });
    initData.nodes = _.compact(initData.nodes); // 将数组的 假值 去掉
    // 跟新删除节点父级节点状态
    
    parentList.forEach(ele => { // 将父级节点的children 进行修改
      if (ele.form && ele.form.children) {
        ele.form.children.forEach((element, index) => {
          if (element.id === item.id) {
            ele.form.children.splice(index, 1);
          }
        });
      }
    });
    initData.nodes.forEach((ele, i) => {
      parentList.forEach(element => {
        if (ele.id === element.id) {
          initData.nodes[i] = element;
        }
      });
    });
    
    util.updateData(initData.nodes); // 更新数据

    if (currentNode.nodeType === 'FORK') {
      let peer = db.select({ pid: currentNode.pid });
      peer.forEach(ele => {
        ele.name = util.forkAddName(ele.id);
      });
      peer.forEach(ele => { // 数据存储 更新节点 进行修改
        this.graph.update(ele.id, ele);
      });
    }
    parentList.forEach(ele => { // 数据存储 更新节点 进行修改
      this.graph.update(ele.id, ele);
    });
    // console.log('=======================');
    const node = this.graph.findById(item.id);
    this.graph.remove(node); // 最终将数据删除
    
    parentList.forEach(ele => { // 将父级节点的children 进行修改
      this.graph.update(ele.id, ele);
    });
    this.updataNode();
  }
  // 删除线
  removeEdge(item) {
    let initData = loadStore(); // 将数据拿出来
    const db = new DB('db list', initData.nodes, 'id', 'pid'); // 获取实例

    let sourceItem = db.selectOne({ id: item.sourceId }); // 拿到对应的线的 源头元素
    let childrenItem = db.selectOne({ id: item.targetId }); // 拿到对应的线的 目标元素
    
    if (!sourceItem.form) {
      sourceItem.form = {};
      sourceItem.form.children = [];
    } else if (sourceItem.form && !sourceItem.form.children) {
      sourceItem.form.children = [];
    } else if (sourceItem.form && sourceItem.form.children) {
      sourceItem.form.children.forEach((ele, index) => {
        if (ele.id === childrenItem.id) { // 删除线条 父级中的form.children 中删除 子集中的id
          sourceItem.form.children.splice(index, 1);
        }
      });
    }
    
    childrenItem.pid = childrenItem.pid.map(t => { // 便利 将 pid中的 sourceId 进行替换
      return t === item.sourceId ? false : t;
    });
    childrenItem.pid = _.compact(childrenItem.pid); // 将数组的 假值 去掉

    initData.nodes.forEach((ele, i) => {
      if (ele.id === sourceItem.id) {
        initData.nodes[i] = sourceItem; // 因为它删除一个 children
      }
      if (ele.id === childrenItem.id) { // 因为他删除一个 pid
        initData.nodes[i] = childrenItem;
      }
    });

    /** start 删除线 判断目标节点是不是 分叉 如果是的话 将节点也一同删除 */
    // && childrenItem.form && childrenItem.form.type === 'OTHER'
    if (childrenItem.nodeType === 'FORK') {
      for (let i = 0, nodes = initData.nodes; i < nodes.length; i++) {
        if (nodes[i].id === childrenItem.id) {
          const node = this.graph.findById(initData.nodes[i].id);
          this.graph.remove(node); // 最终将数据删除
          initData.nodes.splice(i, 1);
          break;
        }
      }
      /** end 删除线 判断目标节点是不是 分叉 如果是的话 将节点也一同删除 */
    }
    /**修改数据操作完成之后修改数据 */
    util.updateData(initData.nodes); // 更新数据
    
    this.graph.update(sourceItem.id, sourceItem.id); // 修改源头元素 进行刷新
    
    const itemNode = this.graph.findById(item.id);
    this.graph.remove(itemNode); // 最终将数据删除
  }
  // 删除所有子节点
  removeChildren(model) {
    let initData = loadStore();
    const db = new DB('db list', initData.nodes, 'id', 'pid');
    const currentNode = db.selectOne({id: model.id});
    let child = _.last(db.children({id: currentNode.id})); // 查到同级
    let peerNode = db.select({id: child.pid}); // 查到同级
    
    let parentList = db.select({id: currentNode.pid});
    let list = db.childrenDeep({ id: model.id });
    let idArr = [];
    list.forEach(ele => {
      idArr.push(ele.id);
      const itemNode = this.graph.findById(ele.id);
      this.graph.remove(itemNode); // 最终将数据删除
    });
    initData.nodes = initData.nodes.map(t => { // 将本地存储中的数据 删除的数据 替换假值
      return idArr.indexOf(t.id) !== -1 ? false : t;
    });
    initData.nodes = _.compact(initData.nodes); // 将数组的 假值 去掉

    if (currentNode.nodeType === 'FORK') { // 如果当前接节点是分叉的话 将父级数据中form.children 数据删除 
      parentList.forEach(ele => { // 将父级节点中的children 删除
        ele.form.children.forEach((element, i) => {
          if (element.id === currentNode.id) {
            ele.form.children.splice(i, 1);
          }
        });
      });

      initData.nodes.forEach((ele, i) => { // 将删除后的数据在本地存储的数据进行替换
        parentList.forEach(item => {
          if (ele.id === item.id) {
            initData.nodes[i] = item;
          }
        });
      });
    }

    util.updateData(initData.nodes); // 更新数据
    
    parentList.forEach(ele => { // 更新当前节点的父级状态
      if (ele.nodeType === 'FORK') {
        ele.name = util.forkAddName(ele.id);
      }
      this.graph.update(ele.id, ele);
    });
    peerNode.forEach(ele => { // 更新删除当前节点的同级状态视图
      this.graph.update(ele.id, ele);
    });
  }
  // 复制全部 只需要当前节点
  copyMore(model) {
    let initData = loadStore();
    if (model.pid) {
      delete model.pid;
    }
    const db = new DB('db list', initData.nodes, 'id', 'pid');
    let childNodes = db.childrenDeep({ id: model.id });
    let flag = true;
    for (let j = 0; j < childNodes.length; j++) {
      if (!util.canAddNode(childNodes[j])) { // 复制当前对象中有 分享节点
        flag = false;
        break;
      }
    }
    if (!flag) {
      this.isNext(childNodes, initData); // 是否删除节点元素
    } else { // 啥都不做往下执行
      this.next(childNodes, initData);
    }
  }

  isNext(childNodes, initData) {
    const _that = this;
    // MessageBox.confirm('当前节点中存在"分享节点",是否将其删除!!', '提示', {
    //   confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
    // }).then(() => { // 将节点删除
    //   for (let i = 0; i < childNodes.length; i++) {
    //     if (childNodes[i].nodeType === 'SHARE') {
    //       childNodes.splice(i, 1);
    //     }
    //   }
    //   _that.next(childNodes, initData);
    //   Message({ type: 'success', message: '删除成功!' });

    // }).catch(() => {
    //   Message({ type: 'info', message: '已取消删除' });  
    // });
  }

  next(childNodes, initData) {
    let nodes = util.editIdPid(childNodes);
    delete nodes[0].pid;
    for (let i = 0; i < nodes.length; i++) {// 便利修改后的所有节点  将 secondNode 删除
      if (nodes[i].secondNode) {
        delete nodes[i].secondNode;
      }
      break;
    }

    for (let i = 0; i < nodes.length; i++) {
      nodes[i] = _.omit(nodes[i], ['isDel']);
    }
    
    initData.nodes = initData.nodes.concat(nodes);
    saveStore(initData);
    
    let edges = util.creatEdges(nodes);
    nodes.forEach(ele => {
      if (ele.nodeType === 'FORK') {
        ele.name = util.forkAddName(ele.id);
      }
      this.graph.add(ele.type, ele);
      const node = this.graph.findById(ele.id);
      this.graph.setItemState(node, 'selected', 'health');
    });
    edges.forEach(ele => {
      this.graph.add(ele.type, ele);
    });
  }
  // 添加分叉
  addBifurcate(data) {
    let initData = loadStore();
    const item = util.getNodeById(data.id);
    let forkId = uniqueId(); // 分叉id
    const sourceId = item.id; // 来源id
    let forkItem = {
      "name": '',
      // "label": "分叉: " + forkId + data.type,
      "backImage": releaseNode,
      "x": item.x - 30,
      "y": item.y + 128,
      "id": forkId, // 分叉id
      "pid": [sourceId], // 来源id
      form: {
        type: data.type,
        conditionType: 'CONDITION', // 默认节点状态
        forkName: '',
        forkNumber: '',
      },
      parentNodeType: item.nodeType, // 分叉节点 的 父级
    };
    /** start 判断数据结构 */
    let forkNode = {
      id: forkId,
      type: data.type
    };
    if (!item.form) { // 没有form
      item.form = {};
      item.form.children = [];
    } else if (item.form && !item.form.children) { // 有form 没有 children
      item.form.children = [];
    } else if (item.form && item.form.children) { // 有form 有 children
      // 啥都不做 万一改 做准备
    }
    item.form.children.push(forkNode);
    /**                    流量分配                    普通分叉                       指定位序*/
    if (item.nodeType === 'FLOWDIS' && data.type === 'NORMAL' && item.form.type === 'ORDER') {
      forkItem.form.value = [];
      forkItem.form.value.push(item.form.children.length - 1);
    }

    /** end 判断数据结构 */
    // 替换存储中源有数据 因为添加了 children 字段
    for (let i = 0, arr = initData.nodes; i < arr.length; i++) {
      if (arr[i].id === item.id) {
        arr[i] = item;
        break;
      }
    }
    const node = _.assign({}, forkItem, baseNodeParme);
    initData.nodes.push(node);
    util.updateData(initData.nodes);
    const obj = {
      targetId: forkId, // 目标id 就是当前分叉id
      sourceId: sourceId,
    };
    


    node.name = util.forkAddName(forkId);
    const edge = util.creatOnceEdge(obj);
    this.graph.add('node', node);
    this.graph.add('edge', edge);
    this.graph.update(item.id, item);

    this.updataNode();
  }
  // 节点流量分配
  flowDistribution(data) {
    let currentNode = util.getNodeById(data.id);
    currentNode.name = util.forkAddName(data.id);
    this.graph.update(data.id, currentNode);
  }
  // 修改节点颜色
  editNodeColor(data, color) {
    let model = {
      color: color,
    };
    if (_.isArray(data)) {
      data.forEach(ele => {
        model.id = ele;
        this.graph.update(ele, model);
      });
    } else {
      model.id = data;
      this.graph.update(data, model);
    }
  }
  // 跟新分叉节点名称
  updataNode() {
    // let currentNode = util.getNodeById(data.id);
    setTimeout(() => {
      let { nodes } = loadStore();
      const db = new DB('db list', nodes, 'id', 'pid');
      let forkNodes = db.select({nodeType: 'FORK'}) || [];
      forkNodes.forEach(node => {
        this.graph.update(node.id, node);
      });
    }, 100);
  }
  // deal改变刷新视图
  updateTheView(data) {
    let initData = loadStore();
    const db = new DB('db list', initData.nodes, 'id', 'pid');
    const itemModel = db.selectOne({id: data.id});
    this.graph.update(data.id, itemModel);
  }
  // 投放节点开关
  switchChange(data) { // data
    let initData = loadStore();
    const db = new DB('db list', initData.nodes, 'id', 'pid');
    let itemModel = db.selectOne({id: data.id});
    if (itemModel.nodeType !== 'ORDER') {
      return;
    }
    if (data.value === 'OPEN') {
      itemModel.backImage = itemModel.openImg;
    } else if (data.value === 'CLOSE') {
      itemModel.backImage = itemModel.closeImg;
    }
    for (let i = 0; i < initData.nodes.length; i++) {
      if (initData.nodes[i] === itemModel.id) {
        initData.nodes[i] = itemModel;
        break;
      }
    }
    util.updateData(initData.nodes);
    this.graph.update(data.id, itemModel);
  }
  // 删除当前节点的所有的分叉
  removeCurFork(data) {
    const initData = loadStore();
    const db = new DB('db list', initData.nodes, 'id', 'pid');
    let childNode = db.select({pid: data.id});
    if (childNode && childNode.length) {
      for (let i = 0; i < childNode.length; i++) {
        this.removeItem(childNode[i]);
      }
    }
  }
  // 移动框选节点
  getMoveGroupNodes(nodesId) {
    let selectNodes = util.getNodeById(nodesId);
    console.log(selectNodes);
  }
  // 移动多个节点  修改节点位置
  moveGroupNodes(nodes) { // , e, origin
    let initNodes = loadStore().nodes;
    nodes.forEach(item => {
      initNodes.forEach( (ele, i) => {
        if (ele.id === item.id) {
          initNodes[i].x = item.x;
          initNodes[i].y = item.y;
        }
        
      });
    });
    util.updateData(initNodes);
    this.graph.setMode("default");
    const selected = this.graph.findAllByState('node', 'selected');
    
    _.each(selected, node => {
      this.graph.setItemState(node, 'selected', false);
      this.graph.update(node, node);
    });
    
  }

  bindEvent() {
    this.graph.on('node:contextmenu', evt => {
      evt.preventDefault();
      evt.stopPropagation();
      transferObj.transferContextmenuClick(evt);
    });
  }
}