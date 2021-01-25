/**
 *  工具类
 */
// import { // Message } from 'element-ui';
import { v4 as uniqueId } from 'uuid';
import _ from 'lodash';
import DB from '@fengqiaogang/dblist';
import {loadStore, saveStore } from './storage';
import {edgeBase} from '../components/Base/edgeBaseOpt.js';
import safeGet from '@fengqiaogang/safe-get';
import {nodeType, baseNodeType} from './enum';
// node节点shape类型
export const NODE_CIRCLE_TYPE = 'flow-circle';
export const NODE_RHOMBUS_TYPE = 'flow-rhombus';
export const NODE_RECT_TYPE = 'flow-rect';
export const NODE_CAPSULE_TYPE = 'flow-capsule';
export const NODE_IMAGE_TYPE = 'image';
export const NODE_CUSTOMNODE_TYPE = 'customNode';
export const NODE_TYPES = [NODE_CUSTOMNODE_TYPE, NODE_IMAGE_TYPE, NODE_CIRCLE_TYPE, NODE_RHOMBUS_TYPE, NODE_RECT_TYPE, NODE_CAPSULE_TYPE];

// edge节点
export const EDGE_TYPE = 'flow-smooth'; // 边形状

//const EDGE_LINE_COLOR = ;
export const EDGE_YES_LINE_TEXT = '#F56464';
export const EDGE_NO_LINE_TEXT = '#7ca5f9';
const meadiaType = ['MEDIA', 'SHAREMEDIA'];

/**
 * @param {*} 判断是否可以连线
 * @argument sourceId: 源头ID
 * @argument targetId: 目标ID
 * @argument graph: 画布
 */
export function canConnect(sourceId, targetId, graph) {  
  if(sourceId === targetId) {
    // Message.error('不能自己连自己');
    return false;
  }
  let startNode = getNodeById(sourceId);
  let endNode = getNodeById(targetId);
  const sourceNode = graph.findById(sourceId);      // 拿到画布节点输出线
  const sourceNodeEdges = sourceNode.getOutEdges(); // 拿到画布节点输出线
  
  const targetNode = graph.findById(targetId);      // 拿到画布节点输入线
  const targetNodeEdges = targetNode.getInEdges(); // 拿到画布节点输入线
  if (endNode.nodeType === 'FORK' && nodeType.indexOf(startNode.nodeType) !== -1) {
    // Message.error('这些节点不能连接分叉节点');
    return false;
  }
  if (startNode.nodeType === 'FORK') {
    if (sourceNodeEdges.length === 1) {
      // Message.error('分叉节点只能有一个输出');
      return false;
    }
  }
  if (baseNodeType.indexOf(startNode.nodeType) !== -1 && endNode.nodeType !== 'FORK') {
    // Message.error('基础节点只能连接分叉节点');
    return false;
  }

  if (targetNodeEdges.length) {
    for (let i = 0; i < targetNodeEdges.length; i++) {
      console.log(targetNodeEdges[i]._cfg.sourceNode._cfg.id);
      let sourceNodeItem = getNodeById(targetNodeEdges[i]._cfg.sourceNode._cfg.id);
      console.log(sourceNodeItem);
      console.log(startNode);
      
      if (sourceNodeItem.nodeType === 'MEDIA' || sourceNodeItem.nodeType === 'SHAREMEDIA') { // meadiaType.indexOf(sourceNodeItem.nodeType) !== -1
        if (startNode.nodeType !== 'MEDIA' && startNode.nodeType !== 'SHAREMEDIA') {
          // Message.error('如果源头节点是流量节点,就不能连其他节点');
          return false;
        }
      }
      if (sourceNodeItem.nodeType !== 'MEDIA' && sourceNodeItem.nodeType !== 'SHAREMEDIA') {
        // Message.error('节点只能有一个输入');
        return false;
      }
    }
  }
  
  if (meadiaType.indexOf(startNode.nodeType) !== -1) { // 连线的源头是 媒体 在往下进行
    let nodes = loadStore().nodes || [];
    let db = new DB('select', nodes, 'id', 'pid');
    let mediaNode = db.select({nodeType: meadiaType}); // 将流量节点全部查出来
    let mediaChildArr = db.select({pid: _.map(mediaNode, item => { return item.id; })}); // 那到流量节点所连接的基础节点
    if (mediaChildArr.length === 1) {
      if (_.first(mediaChildArr).id !== endNode.id) {
        // Message.error('流量节点不能有分叉');
        return false;
      }
    }
  }
  
  
  return true;
}

/**
 * @method 判断是否可以添加节点
 * @param {*} data 节点信息
 */
export function canAddNode() { // item
  // const nodes = loadStore().nodes || []; // 判断使用
  /* if (item.nodeType === 'SHARE') { // 分享节点
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === 'SHARE') {
        // throw new Error('keyName 不能为空');
        // Message.error('画布中只能存在一个分享节点');
        return false;
      }
    }
  } */
  return true;
}

/**
 * @param {*} data 线的对象
 * 给source 生成children
 */
export function createChildren(data) {
  let courceNode = getNodeById(data.sourceId);
  let targetNode = getNodeById(data.targetId);
  if (targetNode.nodeType === 'FORK' ) {
    if (!courceNode.form) {
      courceNode.form = {};
      courceNode.form.children = [];
    } else if (courceNode.form && !courceNode.form.children) {
      courceNode.form.children = [];
    } else if (courceNode.form && courceNode.form.children) {
      // 不管
    }
    const obj = {
      id: targetNode.id, // 目标源id
      type: targetNode.form.type, // 因为创建节点的时候已有 在 components/G6Editor/index 创建
    };
    courceNode.form.children.push(obj);
    updateData(courceNode); // 更新存储数据
    return true;
  }
  return false;
}

/**
 * @param {data: 线的对象}
 * // 生成pid
 */
export function creatPid(data, flag = false) {
  const sourceId = data.sourceId;
  let targetItem = getNodeById(data.targetId);
  if (_.isArray(targetItem.pid)) {
    targetItem.pid.push(sourceId);
  } else {
    let arr = [];
    arr.push(sourceId);
    targetItem.pid = arr;
  }
  updateData(targetItem);
  if (flag) {
    return targetItem;
  } else {
    return false;
  }
}

/**
 * 更新数据
 * @param {*}
 */
export function updateData(item) {
  let initData = loadStore();
  if (_.isArray(item)) {
    initData.nodes = item;
  } else if (_.isArray(item) === false) {
    initData.nodes = _.map(initData.nodes, ele => {
      return ele.id === item.id ? item : ele;
    });
  }
  saveStore(initData);
}


/***
 * @method 生成线条数组的方法
 * @param {data} data: 原数据传进来 生成线数组并返回
 * 
 */
export function creatEdges(data) {
  let edges = [];
  if (_.isArray(data)) {
    data.forEach(ele => {
      if (ele.pid && ele.pid !== '-1') {
        if (ele.showFlag === true) {
          ele.pid.forEach(item => {
            let edgeItem = {
              id: uniqueId(),
              targetId: ele.id,
              target: ele.id,
              source: item,
              sourceId: item
            };
            const sourceNode = getNodeById(item);
            const targetNode = getNodeById(ele.id);
            if (sourceNode && targetNode) {
              const source_y_size = _.last(sourceNode.size) - 0;
              const target_y_size = _.last(targetNode.size) - 0;
              const opt = _.assign({}, edgeBase(source_y_size, target_y_size), edgeItem);
              edges.push(opt);
            }
          });
        }
      }
    });
  }
  return edges;
}

/**
 * @method 生成一条线的所需参数
 * @param {data 生成一条线的所需参数}
 */
export function creatOnceEdge(data) {
  let edge = {};
  let edgeItem = {
    "id": uniqueId(),
    "source": data.sourceId ? data.sourceId : '',
    "sourceId": data.sourceId ? data.sourceId : '',
    "targetId": data.targetId,
    "target": data.targetId,
    startPoint: {},
    endPoint: {},
  };
  const sourceNode = getNodeById(data.sourceId);
  const source_y_size = _.last(sourceNode.size) - 0;
  
  const targetNode = getNodeById(data.targetId);
  const target_y_size = _.last(targetNode.size) - 0;
  edge = _.assign({}, edgeItem, edgeBase(source_y_size, target_y_size));
  return edge;
}

/**
 * @method 删除数据并更新
 */
export function deleteDataAndUpdate(item) {
  let data = loadStore();
  data.nodes = data.nodes.map(t => {
    return t.id === item.id ? false : t;
  });
  data.nodes = _.compact(data.nodes);
  // store.dispatch('editor/setInitData', data);
  saveStore(data);
  return true;
}


/**
 * @method id更新
 * @param data: 数据源 数组
 * @param param 要修改的参数 参数值为数组, 默认 param = ['id']
 */
export function updateId(data, param = ['id']) {
  let nodes = [];
  if (data && data instanceof Array) {
    nodes = _.cloneDeep(data);
  }
  const idEndData = parseInt((new Date().getTime() / 1000)).toString();
  param.forEach(item => { // 遍历参数
    const key  = item;
    nodes.forEach(ele => { // 遍历数据源
      if (ele[key] && typeof ele[key] === 'string' && ele[key] !== '-1') { // 数据存在 并且是字符串
        if (ele.id.indexOf('^') !== -1) { // 说明之前拼接过
          ele[key] = ele[key].split('^')[0];
          ele[key] = `${ele[key]}^${idEndData}`;
        } else { // 没有拼接过
          ele[key] = `${ele[key]}^${idEndData}`;
        }
      } else if (ele[key] && ele[key] instanceof Array && ele[key].length !== 0) { // 是数组
        ele[key].forEach((element, index) => { // 如果要更新的数据为数组
          if (element.indexOf('^') !== -1) { // 说明之前拼接过
            ele[key][index] = element.split('^')[0];
            ele[key][index] = `${ele[key][index]}^${idEndData}`;
          } else { // 没有拼接过
            ele[key][index] = `${ele[key][index]}^${idEndData}`;
          }
        });
      }
      if (ele.form && ele.form.children && ele.form.children.length) {
        ele.form.children.forEach((e, i) => {
          if (e.id.indexOf('^') !== -1) {
            ele.form.children[i]['id'] = e.id.split('^')[0];
            ele.form.children[i]['id'] = `${ele.form.children[i]['id']}^${idEndData}`;
          } else {
            ele.form.children[i]['id'] = `${ele.form.children[i]['id']}^${idEndData}`;
          }
        });
      }
      ele.x = ele.x + 20;
      ele.y = ele.y + 20;
    });

  });
  return nodes;
}

export function editIdPid(data) {
  let nodes = _.cloneDeep(data);
  let nodeStr = JSON.stringify(nodes);
  const idArr = [];
  nodes.forEach(item => {
    idArr.push(item.id);
  });
  for (let i = 0; i < idArr.length; i++) {
    let id = uniqueId();
    let reg = new RegExp(`${idArr[i]}`,"g");
    nodeStr = nodeStr.replace(reg, id);
  }
  nodes = JSON.parse(nodeStr);
  for (let k = 0; k < nodes.length; k++) {
    nodes[k].x = nodes[k].x + 25;
    nodes[k].y = nodes[k].y + 25;
  }
  return nodes;
}

/**
 * 
 * @param {*} id 当前节点ID
 * @param {*} data 提前准备的所有node
 */
export function isFold(id) {
  let initData = loadStore();
  if (!initData || !initData.nodes) {
    return false;  
  }
  const db = new DB('db list', initData.nodes, 'id', 'pid');
  let pidList = db.select({ pid: id });
  
  if (pidList && pidList.length !== 0) {
    return true;
  } else {
    return false;
  }
}


/**
 * 
 * @param {*} id 分叉节点id 
 */
export function forkAddName(id) {
  let nodes = loadStore().nodes;
  const nodeDB = new DB('nodes', nodes, 'id', 'pid');
  const parent = nodeDB.selectOne({ id: safeGet(nodeDB.selectOne({ id }), 'pid') });
  const nodeChildren = _.map(safeGet(parent, 'form.children'), (value, index) => {
    return _.assign({ name: String.fromCharCode(65 + index) }, value);
  });
  const childrenDB = new DB('children', nodeChildren, 'id', 'pid');

  return safeGet(childrenDB.selectOne({ id }), 'name');
}

/**
 * 是否是node节点类型
 * @param {*} item 
 */
export function isNode(item) {
  if (item === true) {
    return true;
  } else {
    return false;
  }
}

export function canHandle(model) {
  if (model.type === 'node') {
    if (model.isDel === 'NO') { // true  不能删
      return false;
    }
  } else if (model.type === 'edge') {
    const sourceNode = getNodeById(model.sourceId);
    const targetNode = getNodeById(model.targetId);
    if (targetNode.isDel || sourceNode.isDel) {
      return false;
    }
  }
  return true;
}

/**
 * 是否是起始节点
 * @param {*} item 
 */
export function isStartNode(item) {
  if (!item) {
    return false;
  }
  if (NODE_CIRCLE_TYPE === item.shape) {
    return true;
  }
  return false;
}

/**
 * 是否是分支节点
 * @param {*} item 
 */
export function isRhombusNode(item) {
  if (!item) {
    return false;
  }

  if (NODE_RHOMBUS_TYPE === item.shape) {
    return true;
  }

  return false;
}

/**
 * 是否是常规节点
 * @param {*} item 
 */
export function isRectNode(item) {
  if (!item) {
    return false;
  }

  if (NODE_RECT_TYPE === item.shape) {
    return true;
  }

  return false;
}


/**
 * 是否是模型节点
 * @param {*} item 
 */
export function isCapsuleNode(item) {
  if (!item) {
    return false;
  }

  if (NODE_CAPSULE_TYPE === item.shape) {
    return true;
  }

  return false;
}

/**
 * 是否是edge线类型
 * @param {*} item 
 */
export function isLine(item) {
  if (item === true) {
    return true;
  } else {
    return false;
  }
}

/**
 * 编辑器中是否已经有了一个起始节点[ 有且只能有一个起始节点 ]
 * @param {*} graph 
 * @return n 起始节点的个数
 */
export function hasStartPoint(graph) {
  if (!graph) {
    return false;
  }

  const nodes = graph.getNodes();
  if (!nodes || nodes.length <= 0) {
    return 0;
  }

  for (let node of nodes) {
    if (isStartNode(node.model)) {
      return true;
    }
  }

  return false;
}

/**
 * 得到节点的入口边集合
 * @param {*} node 
 * @param {*} graph 
 */
export function nodeInLines(node, graph) {
  const lists = [];
  if (!node || !graph) {
    return lists;
  }
  const edges = graph.getEdges();
  for (let edge of edges) {
    let edgeTarget = edge['model']['target'];
    if ((typeof node === 'string' && edgeTarget === node) ||
      (typeof node === 'object' && edgeTarget === node.id)) {
      lists.push(edge);
    }
  }
  return lists;
}

/**
 * 得到节点的出口边集合
 * @param {*} node 
 * @param {*} graph 
 */
export function nodeOutLines(node, graph) {
  const lists = [];
  if (!node || !graph) {
    return lists;
  }

  const edges = graph.getEdges();
  for (let edge of edges) {
    let edgeTarget = edge['model']['source'];
    if ((typeof node === 'string' && edgeTarget === node) ||
      (typeof node === 'object' && edgeTarget === node.id)) {
      lists.push(edge);
    }
  }
  return lists;
}



/**
 * 根据节点id得到节点本身
 * @param {*} graph 
 * @param {*} nodeId 
 */
export function getNodeById(nodeId) {
  let node = [];
  let nodes = loadStore().nodes;
  if (_.isArray(nodeId)) {
    for (let i = 0; i < node.length; i++) {
      for (let k = 0; k < nodeId.length; k++) {
        if (nodeId[k] === nodes[i].id) {
          node.push(node[i]);
        }
      }
    }
  } else {
    node = nodes.find(x => x.id === nodeId);
  }
  return node;
}

/**
 * 
 * @param {*} node 当前节点对象
 */
export function judgNodeType(node) {
  let curNodeType = null;
  if (node) {
    curNodeType = node.curNodeType;
  }
  
  const nodeTypeEnum = ['FORK'];
  if (node && node.type === 'node' && nodeTypeEnum.indexOf(curNodeType) === -1) {
    return true;
  }
  return false;
}


/**
 * 添加动作 ==========================================
 */

/**
 * 修改边
 * @param {*} graph 
 * @param {*} item 
 */
export function modifyLineWithYes(graph, item) {
  if (!graph && !item) {
    return false;
  }

  item.label = {
    text: '是',
    fill: EDGE_YES_LINE_TEXT,
  };
  item.color = EDGE_YES_LINE_TEXT;
  item.judge = 1; //设置自定义变量 代表是

  graph.update(item.id, item);
}

export function modifyLineWithNo(graph, item) {
  if (!graph && !item) {
    return false;
  }

  item.label = {
    text: '否',
    fill: EDGE_NO_LINE_TEXT,
  };
  item.color = EDGE_NO_LINE_TEXT;
  item.judge = 0; //设置自定义变量 代表否

  graph.update(item.id, item);
}




// ui
/**
 * 操作非法提示
 * @param {*} msg 
 */
export function operationIllegal(msg) {
  // Message({
  //   // Message: msg || '操作非法',
  //   type: 'error',
  // });
}


// 集合操作
/**
 * 线类
 */
export class Line {
  constructor(sourceId, targetId) {
    this.sourceId = sourceId;
    this.targetId = targetId;
  }
  /**
   * 判断两条线是否相等
   * @param {*} line1 
   * @param {*} line2 
   */
  static lineEquale(line1, line2) {
    if (line1 === line2) {
      return true;
    }
    if (!line1 || !line2) {
      return false;
    }
    if (line1.sourceId === line2.sourceId && line1.targetId === line2.targetId) {
      return true;
    }

    return false;
  }
}

/**
 * 线是否在线集合中
 * @param {*} line 
 * @param {*} list 
 */
export function lineInList(line, list) {
  if (!line || !list || !Array.isArray(list)) {
    return false;
  }

  for (let __ of list) {
    if (Line.lineEquale(line, __)) {
      return true;
    }
  }

  return false;
}

/**
 * 得到图的全部的边集合
 * @param {*} graph 
 */
export function getCurrentLineList(graph) {
  if (!graph) {
    return [];
  }
  const list = [];
  const edges = graph.getEdges();
  for (let edge of edges) {
    if (edge.model && edge.model.source && edge.model.target) {
      let line = new Line(edge.model.source, edge.model.target);
      list.push(line);
    }
  }

  return list;
}


/**
 * 得到图的全部的边带模型集合
 * @param {*} graph 
 */
export function getCurrentEdgeModelList(graph) {
  if (!graph) {
    return [];
  }

  const list = [];
  const edges = graph.getEdges();
  for (let edge of edges) {
    list.push(edge.model);
  }

  return list;
}


/**
 * 新边是否合法
 * @param {*} newLineItem 
 * @param {*} graph 
 */
export function isNewEdgeLegal(newEdgeItem, graph) {
  if (!newEdgeItem || !graph) {
    return false;
  }

  const newEdgeLine = new Line(newEdgeItem.source, newEdgeItem.target);
  const currentLines = getCurrentLineList(graph);
  if (lineInList(newEdgeLine, currentLines)) {
    return false;
  } else {
    return true;
  }
}


// ========================     查找     ===========================
/**
 *  全部依赖model
 */

/**
 * 通过node id在集合中查找node
 * @param {*} ndoeId 
 * @param {*} nodes 
 */
export function findNodeById(ndoeId, nodes) {
  if (!ndoeId || !nodes || !Array.isArray(nodes)) {
    return;
  }

  for (let node of nodes) {
    if (ndoeId === node.id) {
      return node;
    }
  }

  return null;
}

/**
 * 查找起始节点
 * @param {*} nodes 
 */
export function findStartNode(nodes) {
  if (!nodes || !Array.isArray(nodes)) {
    return;
  }

  for (let node of nodes) {
    if (isStartNode(node)) {
      return node;
    }
  }
}

/**
 * 查找起始节点的下一个节点
 * @param {*} nodes 
 * @param {*} edges 
 */
export function findStartNextNode(nodes, edges) {
  if (!nodes || !Array.isArray(nodes) || !edges || !Array.isArray(edges)) {
    return null;
  }

  const startNode = findStartNextNode(nodes);
  if (!startNode) {
    return null;
  }

  let children = findNodeOutEdge(startNode);
  if (!children || children.length !== 1) {
    return '起始节点的出口边不是1';
  }

  const startNextNode = findNodeById(children[0].source);
  return startNextNode;
}



/**
 * 计算node节点的入口边
 * @param {*} node 
 * @param {*} edges 
 */
export function findNodeInEdge(node, edges) {
  if (!node || !edges || !Array.isArray(edges)) {
    return [];
  }

  const ins = [];
  for (let edge of edges) {
    if (edge.target === node.id) {
      ins.push(edge);
    }
  }
  return ins;
}
/**
 * 计算node节点的出口边
 * @param {*} node 
 * @param {*} edges 
 */
export function findNodeOutEdge(node, edges) {
  if (!node || !edges || !Array.isArray(edges)) {
    return [];
  }

  const outs = [];
  for (let edge of edges) {
    if (edge.source === node.id) {
      outs.push(edge);
    }
  }
  return outs;
}



/**
 * 查找节点的父节点
 * @param {*} node 
 * @param {*} nodes 
 * @param {*} edges 
 */
export function findNodeParent(node, nodes, edges) {
  if (!node || !nodes || !Array.isArray(nodes) ||
    !edges || !Array.isArray(edges)) {
    return;
  }

  // 判断是否是起始节点
  if (isStartNode(node)) {
    return;
  }

  let ins = findNodeInEdge(node, edges);
  if (!ins || !ins.length || ins.length !== 1) {
    return;
  }
  const inEdge = ins[0];
  const inEdgeTarget = inEdge['source'];

  let parent = findNodeById(inEdgeTarget, nodes);

  return parent;
}

/**
 * 查找节点的子节点
 * @param {*} node 
 * @param {*} nodes 
 * @param {*} edges 
 */
export function findNodeChilren(node, nodes, edges) {
  if (!node || !nodes || !Array.isArray(nodes) ||
    !edges || !Array.isArray(edges)) {
    return;
  }
  const children = [];
  const outEdges = findNodeOutEdge(node, edges);
  for (let outEdge of outEdges) {
    const temp = findNodeById(outEdge['target'], nodes);
    temp && children.push(temp);
  }
  return children;
}
