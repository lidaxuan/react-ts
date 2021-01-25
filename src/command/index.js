import {
  uniqueId
} from '@/utils';

import * as util from './util';
// import { Message } from 'element-ui';
import DB from '@fengqiaogang/dblist';
import _ from 'lodash';
import {loadStore, saveStore} from './storage.js';


class command {
  // editor = null;
  // undoList = []
  // redoList = []
  constructor(editor) {
    this.editor = editor;
    this.undoList = [];
    this.redoList = [];
  }
  executeCommand(key, datas) {
    console.log('------------');
    // console.log(key, datas);
    const list = [];
    datas.map(data => {
      let model = data;
      if (key === 'add') {
        model.id = data.type + uniqueId();
      }
      if (key === 'delete') {
        if (data.getType() === 'node') {
          const edges = data.getEdges && data.getEdges();
          model = data.getModel();
          model.type = data.getType();
          model.id = data.get('id');
          edges.forEach(edge => {
            let edgeModel = edge.getModel();
            edgeModel.type = 'edge';
            edgeModel.id = edge.get('id');
            list.push(edgeModel);
          });
        } else if (data.getType() === 'edge') {
          model = data.getModel();
          model.type = data.getType();
          model.id = data.get('id');
        }
      }
      list.push(model);
      this.doCommand(key, model, datas);
    });
    this.undoList.push({ key, datas: list});
    if (key === 'delete') {
      this.redoList = [];
    }
    this.editor.emit(key, {
      undoList: this.undoList,
      redoList: this.redoList
    });
  }
  doCommand(key, data, datas) {
    if (key === 'add') {
      if (data.type === 'edge') { // 线
        if (!util.canConnect(data.sourceId, data.targetId)) {
          return;
        } else {
          this.add(data, datas);
        }
      } else if (data.type === 'node') {
        console.log('datadatadatadata', data);
        if (data.nodeType === 'SHARE') { // 分享节点
          let initData = loadStore();
          let nodes = initData.nodes;
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeType === 'SHARE') {
              // Message.error('画布中只能存在一个分享节点');
              return;
            }
          }
        }
        this.add(data);
      }
    } else if (key === 'update') { // 更新数据的时候 既要更新视图 也得更新数据
      console.log('datadata', data);
      const currentId = data.item._cfg.id;
      let currentItem = util.getNodeById(currentId);
      console.log('currentItemcurrentItem', currentItem);
      currentItem.x = data.newModel.x;
      currentItem.y = data.newModel.y;
      this.update(data.item, currentItem); // data.newModel
    } else if (key === 'delete') {
      this.remove(data, datas);
    }
  }
  // 添加的方法
  async add(data, datas) {
    // let that = this;
    this.editor.add(data.type, data);
    if (data.type === 'node') {
      let nodeObj = await loadStore();
      if (nodeObj && nodeObj.nodes) { // 如果有只
        nodeObj.nodes.push(data);
        saveStore(nodeObj);
      } else {
        nodeObj.nodes = [data];
        saveStore(nodeObj);
      }
    } else if (data.type === 'edge') {
      const res = util.creatPid(data, true); // 生成pid
      // console.log('resresresresres', res);
      if (res) {
        let model = datas[0].source._cfg.model;
        // that.update(datas[0].source, model);
        this.editor.update(datas[0].source, model);
      }
    }
    console.log(2);
  }
  // 更新 数据与视图
  update(item, model) {
    this.editor.update(item, model);
    // console.log('model', item._cfg.model);
    util.updateData(item._cfg.model);
  }
  /** 
   * 以下方法重写
   * -----------------------------------------
   */
  // 添加节点
  addNode(item) {
    item.id = uniqueId();
    let initData = loadStore();
    if (!util.canAddNode(item)) { 
      return;
    }
    let nodes = initData.nodes || [];
    nodes.push(item);
    initData.nodes = nodes;
    saveStore(initData);
    console.log(234);
    this.editor.add(item.type, item);
  }
  // 移动节点更新数据
  moveNodeUpdata(item) {
    let model = item.item._cfg.model;
    let currentItem = util.getNodeById(model.id);
    console.log('currentItemcurrentItem', currentItem);
    currentItem.x = item.newModel.x;
    currentItem.y = item.newModel.y;
    // return;
    util.updateData(currentItem);
    try {
      this.editor.update(currentItem.id, item.newModel);
    } catch (error) {
      console.log(error);
    }
  }
  // 添加线
  createEdge(data) {
    /** 是否可以连线 */
    if (!util.canConnect(data.sourceId, data.targetId)) {
      return;
    }
    const res = util.creatPid(data, true); // 生成pid
    util.createChildren(data); // 父级生成children
    
    if (res) {
      this.editor.add(data.type, data);
      this.editor.update(data.sourceId, data.sourceId);
    }
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

    /** start 删除线 判断目标节点是不是 其他分叉 如果是的话 将节点也一同删除 */
    if (childrenItem.nodeType === 'FORK' && childrenItem.form && childrenItem.form.type === 'OTHER') {
      for (let i = 0, nodes = initData.nodes; i < nodes.length; i++) {
        if (nodes[i].id === childrenItem.id) {
          console.log('childrenItem', childrenItem);
          this.editor.remove(initData.nodes[i]); // 最终将数据删除
          initData.nodes.splice(i, 1);
          break;
        }
      }
      /** end 删除线 判断目标节点是不是 其他分叉 如果是的话 将节点也一同删除 */
    }
    /**修改数据操作完成之后修改数据 */
    util.updateData(initData.nodes); // 更新数据
    
    this.editor.update(sourceItem.id, sourceItem.id); // 修改源头元素 进行刷新
    this.editor.remove(item); // 最终将数据删除
  }
  // 删除数据并更新 --- 单条数据
  remove(item, datas) {
    // console.log('remove', item);
    let initData = loadStore(); // 将数据拿出来
    const db = new DB('db list', initData.nodes, 'id', 'pid'); // 获取实例
    let childrenItem = null;
    if (item.type === 'node') { // 删除节点
      // -----------  start 更新children中的pid -----------
      childrenItem = db.select({ pid: item.id });
      let currentItem = db.selectOne({ id: item.id });
      let parentList = db.select({ id: currentItem.pid }); // 查找出来 删除节点的父级
      
      /** 将删除节点的子数据 的pid 进行删除 然后修改存储 */
      if (childrenItem && childrenItem.length) { // 如果查询出来 反之查询不出来
        childrenItem = childrenItem[0];
        _.pullAll(childrenItem.pid, [item.id]); 
        util.updateData(childrenItem); // 更新数据
      }
      // -----------  end  更新children中的pid -----------

      const res = util.deleteDataAndUpdate(_.cloneDeep(item)); //  删除节点的话 需要将对应的数据删掉 并更新
      
      // 跟新删除节点父级节点状态
      if (res) {
        parentList.forEach(ele => { // 将父级节点的children 进行修改
          if (ele.form && ele.form.children) {
            ele.form.children.forEach((element, index) => {
              if (element.id === currentItem.id) {
                console.log(element.id, currentItem.id);
                
                ele.form.children.splice(index, 1);
              }
            });
          }
          console.log('eleele', ele);
          
          this.editor.update(ele.id, ele.id);
        });
        
        initData.nodes.forEach((ele, i) => {
          parentList.forEach(element => {
            if (ele.id === element.id) {
              initData.nodes[i] = element;
            }
          });
        });
        util.updateData(initData.nodes); // 更新数据
      }
      console.log('22222');
      
    } else if (item.type === 'edge') {
      // 删除线的话只需要将 target节点pid修改 对应的数据更新就OK
      let sourceIdItem = db.select({ id: item.sourceId }); // 拿到对应的线的 源头元素
      childrenItem = db.selectOne({ id: item.targetId }); // 拿到对应的线的 目标元素

      childrenItem.pid = childrenItem.pid.map(t => { // 便利 将 pid中的 sourceId 进行替换
        return t === item.sourceId ? false : t;
      });
      childrenItem.pid = _.compact(childrenItem.pid); // 将数组的 假值 去掉
      util.updateData(childrenItem); // 更新数据
      console.log('datas[0].source, sourceIdItem', datas[0]._cfg.sourceNode, sourceIdItem);
      
      this.update(datas[0]._cfg.sourceNode, sourceIdItem);
    }
    this.editor.remove(item); // 最终将数据删除
  }
  // 删除当前节点
  removeItem(item) {
    let initData = loadStore(); // 将数据拿出来
    const db = new DB('db list', initData.nodes, 'id', 'pid'); // 获取实例
    let childrenItem = null;

    // -----------  start 更新children中的pid -----------
    childrenItem = db.select({ pid: item.id });
    let currentNode = db.selectOne({id: item.id});
    console.log('currentNode', currentNode);
    let parentList = db.select({ id: currentNode.pid }); // 查找出来 删除节点的父级
    console.log('parentList', parentList);
    
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

    parentList.forEach(ele => { // 数据存储 更新节点 进行修改
      this.editor.update(ele.id, ele.id);
    });
    this.editor.remove(item); // 最终将数据删除

    parentList.forEach(ele => { // 将父级节点的children 进行修改
      this.editor.update(ele.id, ele.id);
    });
  }
  // 删除所有子节点
  removeChildred(model) {
    let initData = loadStore();
    const db = new DB('db list', initData.nodes, 'id', 'pid');
    const currentNode = db.selectOne({id: model.id});
    let parentList = db.select({id: currentNode.pid});
    let list = db.childrenDeep({ id: model.id });
    let idArr = [];
    list.forEach(ele => {
      idArr.push(ele.id);
      this.editor.remove(ele); // 最终将数据删除
    });
    initData.nodes = initData.nodes.map(t => { // 便利 将 pid中的 sourceId 进行替换
      return idArr.indexOf(t.id) !== -1 ? false : t;
    });
    initData.nodes = _.compact(initData.nodes); // 将数组的 假值 去掉
    util.updateData(initData.nodes, false); // 更新数据

    parentList.forEach(ele => { // 更新当前节点的父级状态
      this.editor.update(ele.id, ele.id);
    });
  }
  undo() {
    const undoData = this.undoList.pop();
    const edgeList = [];
    const list = [];
    for (let i = 0; i < undoData.datas.length; i++) {
      const data = undoData.datas[i];
      if (data.type === 'edge') {
        edgeList.push(data);
        continue;
      }
      list.push(data);
      this.doundo(undoData.key, data);
    }
    for (let i = 0; i < edgeList.length; i++) {
      const edge = edgeList[i];
      if (edge.source.destroyed) {
        edge.source = edge.sourceId;

      }
      if (edge.target.destroyed) {
        edge.target = edge.targetId;
      }
      list.push(edge);
      this.doundo(undoData.key, edge);
    }
    this.redoList.push({
      key: undoData.key,
      datas: list
    });
    this.editor.emit(undoData.key, {
      undoList: this.undoList,
      redoList: this.redoList
    });
  }
  doundo(key, data) {
    if (key === 'add') {
      this.remove(data);
    } else if (key === 'update') {
      this.update(data.item, data.oldModel);
    } else if (key === 'delete') {
      this.add(data.type, data);
    }
  }
  redo() {
    const redoData = this.redoList.pop();
    const list = [];
    const edgeList = [];
    for (let i = 0; i < redoData.datas.length; i++) {
      const data = redoData.datas[i];
      if (data.type === 'edge') {
        edgeList.push(data);
        continue;
      }
      list.push(data);
      this.doredo(redoData.key, data);
    }
    for (let i = 0; i < edgeList.length; i++) {
      const edge = edgeList[i];
      if (edge.source.destroyed) {
        edge.source = edge.sourceId;

      }
      if (edge.target.destroyed) {
        edge.target = edge.targetId;
      }
      list.push(edge);
      this.doredo(redoData.key, edge);
    }
    this.undoList.push({
      key: redoData.key,
      datas: list
    });

    this.editor.emit(redoData.key, {
      undoList: this.undoList,
      redoList: this.redoList
    });
  }
  doredo(key, data) {
    if (key === 'add') {
      this.add(data.type, data);
    } else if (key === 'update') {
      this.update(data.item, data.newModel);
    } else if (key === 'delete') {
      this.remove(data);
    }
  }
  delete(item) {
    this.executeCommand('delete', [item]);
  }
}

export default command;