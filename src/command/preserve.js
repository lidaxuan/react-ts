import { loadStore } from '@/command/storage.js';
// import { Message } from 'element-ui';
import _ from 'lodash';
import DB from '@fengqiaogang/dblist';
import safeSet from '@fengqiaogang/safe-set';
import { judgRelationNodeType, baseType } from './enum';
import safeGet from '@fengqiaogang/safe-get';
import { updateData } from '@/command/util';

class ProcessingData {
  constructor (type) {
    this.type = type;
  }
  save(){
    let params = this.methodCall(); // 数据判断 格式化
    if (!params) { // false   Array=>nodeid   Object(格式化好的数据)
      return false;
    }
    if (_.isArray(params)) {
      params = (_.compact(params)); // 去重 去空
    }
    const result = this.forkAddSort(params);
    // console.log(JSON.stringify(result, null, 2));
    console.log(result);
    // console.log(params);return;
    return params;
  }
  // 分叉添加sort
  forkAddSort(data) {
    const { treeDetail } = _.cloneDeep(data);
    const db = new DB('bageyalu', treeDetail, 'id', 'pid');
    const baseNode = db.select({nodeType: baseType}); // 将当前决策树种所有基础节点找出来
    for (let i = 0; i < baseNode.length; i++) {
      // console.log(baseNode[i].data);
      const parentDataChildren = baseNode[i].data.children;
      // const parentDataChildren = db.select({pid: baseNode[i].id});
      for (let j = 0; j < parentDataChildren.length; j++) { // 便利当前节点中children字段
        const child = db.selectOne({id: parentDataChildren[j].id}) || {};
        child.data.sort = j; // sort 赋值
      }
    }
    data.treeDetail = _.cloneDeep(treeDetail);
    return data;
  }
  // 保存草稿
  saveDraft() {
    let data = loadStore();
    
    let params = this.formatBaseInfo(data);
    if (!params.name) {
      params.name = '(无主题)';
    }
    if (!this.checking(params)) { // 检查参数
      return false;
    }
    let formatData = this.formatingData(params); // 将格式化好的数据进行节点判断
    return formatData;
  }
  methodCall () {
    let data = loadStore();
    let params = this.formatBaseInfo(data);
    // start  ========================
    if (!this.checking(params)) { // 检查参数
      return false;
    }
    
    if (!this.checkNode(params.nodes)) {// 判断节点中是否有开始节点 和结束节点
      return false;
    }
    // end     ========================
    let formatData = this.formatingData(params); // 将格式化好的数据进行节点判断
    this.judgRelation(formatData.treeDetail);
    const res = this.checkItme(formatData); // 检查成功是 true 否则是 id
    if (res !== true) { // 节点 id 数组
      return res;
    }
    return formatData;
  }
  // 格式化 顶部基本 数据
  formatBaseInfo(data) {
    for (const key in data.baseInfo) {
      if (data.baseInfo.hasOwnProperty(key)) {
        data[key] = data.baseInfo[key];
      }
    }
    delete data.baseInfo;
    data.type = this.type;
    return data;
  }
  // 判断relation
  judgRelation(data) {
    const db = new DB('select', data, 'id', 'pid');
    const judgNodes = db.select({nodeType: judgRelationNodeType}) || []; // 拿到需要判断的节点
    const orderNode = db.select({nodeType: 'ORDER'}) || []; // 拿到所有的投放节点
    const orderIds = _.map(orderNode, item => { // 拿到所有的投放节点id
      return item.id;
    });
    if (judgNodes && judgNodes.length) {
      judgNodes.forEach((item, index) => {
        let relation = safeGet(item, 'data.relation') || [];
        let arr = [];
        for (let i = 0; i < relation.length; i++) {
          if (relation[i].type === 'NEW') {
            arr.push(relation[i]);
          }
        }
        let i = arr.length;
        while (i--) {
          if (orderIds.indexOf(arr[i].id) === -1) {
            judgNodes[index].data.relation.splice(i, 1);
          }
        }
        safeSet(judgNodes[index], 'data.relation', relation);
      });
      let nodes = loadStore().nodes;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < judgNodes.length; j++) {
          if (nodes[i].id === judgNodes[j].id) {
            nodes[i].form = judgNodes[j].data;
          }
        }
      }
      updateData(nodes);
    }
  }
  // 检查参数
  checking(params) {
    if (!params.name) {
      // Message.error('请输入决策树名称');
      return false;
    }
    return true;
  }
  // 判断节点中是否有开始节点 和结束节点
  checkNode(nodes = []) {
    let result = true;
    let nodeTypeArr = [];
    nodes.forEach(ele => {
      nodeTypeArr.push(ele.nodeType);
    });
    /* const mustInclude = [
      { type: 'MEDIA', name: '流量节点' },
      { type: 'SHAREMEDIA', name: '共享流量' },
    ]; */
    const order = [{ type: 'ORDER', name: '投放节点'}];
    for (let j = 0; j < order.length; j++) {
      if (nodeTypeArr.indexOf(order[j].type) === -1) {
        // Message.error(`决策树中至少包含一个${order[j].name}`);
        result = false;
        return result;
      }
    }
    const db = new DB('select', nodes, 'id', 'pid');
    let medidaList = db.select({nodeType: ['MEDIA', 'SHAREMEDIA']});
    if (!medidaList || !medidaList.length) {
      // Message.error(`决策树中至少包含一个流量节点或者共享流量`);
      result = false;
      return result;
    }

    if (nodeTypeArr.indexOf('MEDIA') === -1) {
      if (nodeTypeArr.indexOf('SHARE') !== -1) {
        // Message.error(`决策树中只有共享流量时, 不能存在分享节点`);
        result = false;
        return result;
      }
    }
    return result;
  }
  // 格式化 节点 数据
  formatingData(data) {
    let nodes = _.cloneDeep(data.nodes || []);
    delete data.nodes;
    nodes.forEach((ele, i) => {
      nodes[i] = _.omit(ele, ['backImage', 'isCollapseShape', 'label', 'shape', 'showFlag', 'size']);
      nodes[i].x = _.cloneDeep(Math.round(ele.x));
      nodes[i].y = _.cloneDeep(Math.round(ele.y));
      nodes[i].data = _.cloneDeep(ele.form);
      delete nodes[i].form;
      nodes[i].detailData = {}; // 没用 后台实体需要     
    });
    const db = new DB('db list', nodes, 'id', 'pid');
    let mediaList = db.select({ nodeType: ['MEDIA', 'SHAREMEDIA'] });
    let idArr = [];
    if (mediaList && _.isArray(mediaList)) {
      mediaList.forEach(ele => {
        idArr.push(ele.id);
      });
    }
    let secondNode = db.selectOne({ pid: idArr });
    if (secondNode) { // undefined
      secondNode.secondNode = 'YES';
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === secondNode.id) {
          nodes[i] = secondNode;
          break;
        }
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      if (!nodes[i].pid || nodes[i].pid === '-1') {
        continue;
      }
      nodes[i].pid = nodes[i].pid.join(',');
    }

    //格式化预算节点
    const budgetNodes = db.select({nodeType: 'BUDGET'}); // 拿到预算节点
    const budgetIds = _.map(budgetNodes, item => { // 拿到预算节点ID
      return item.id;
    });
    const budgetForkNode = db.select({pid: budgetIds}); // 查找分叉
    for (let i = 0; i < budgetForkNode.length; i++) { // 修改数据
      let len = budgetForkNode[i].data.value || [];
      for (let k = 0; k < len.length; k++) {
        const value = budgetForkNode[i].data.value[k] ? budgetForkNode[i].data.value[k] * 100 : 0;
        safeSet(budgetForkNode[i], `data.value[${k}]`, value);
      }
    }
    data.treeDetail = nodes;
    return data;
  }
  //  拿到格式化好的数据 判断节点数据
  checkItme(params) {
    let result = true;
    let nodes = params.treeDetail;
    let breakNodeId = [];
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === 'MEDIA') { // 流量节点
        result = this.judgMedia(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'SHAREMEDIA') { // 共享流量
        result = this.judgShareMedia(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'FREQUENCY') { // 频次节点
        result = this.judgFrequency(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'FORK' && nodes[i].parentNodeType === 'FREQUENCY') { // 频次分叉
        result = this.judgFrequencyFork(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'FOLLOW') { // 追频节点
        result = this.judgFollow(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'FORK' && nodes[i].parentNodeType === 'FOLLOW') { // 追频分叉
        result = this.judgFollowFork(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'AREA') { // 地域节点
        result = this.judgArea(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'FORK' && nodes[i].parentNodeType === 'AREA') { // 地域分叉
        result = this.judgAreaFork(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'CROWD') { // 人群节点
        result = this.judgCrowd(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'FORK' && nodes[i].parentNodeType === 'CROWD') { // 人群分叉
        result = this.judgCrowdFork(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'LABEL') { // 标签节点
        result = this.judgLabel(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'FORK' && nodes[i].parentNodeType === 'LABEL') { // 标签分叉
        result = this.judgLabelFork(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'FLOW') { // 控量节点
        result = this.judgFlow(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'FORK' && nodes[i].parentNodeType === 'FLOW') { // 控量分叉
        result = this.judgFlowFork(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'DATE') { // 日期节点
        result = this.judgDate(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'FORK' && nodes[i].parentNodeType === 'DATE') { // 日期分叉
        result = this.judgDateFork(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'TIME') { // 时间节点
        result = this.judgTime(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'FORK' && nodes[i].parentNodeType === 'TIME') { // 时间分叉
        result = this.judgTimeFork(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'IP') { // IP节点
        result = this.judgIp(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'FORK' && nodes[i].parentNodeType === 'IP') { // 时间分叉
        result = this.judgIpFork(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'BUDGET') { // 预算节点
        result = this.judgBudget(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'FORK' && nodes[i].parentNodeType === 'BUDGET') { // 预算分叉
        result = this.judgBudgetFork(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'FLOWDIS') { // 流量分配
        result = this.judgFlowdis(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'FORK' && nodes[i].parentNodeType === 'FLOWDIS') { // 流量分配分叉
        result = this.judgFlowdisFork(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'ORDER') { // 投放节点
        result = this.judgOrder(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      } else if (nodes[i].nodeType === 'SHARE') { // 分享节点
        result = this.judgShare(nodes[i]);
        if (result !== true) { // 假如 出错 返回的是id  否则是 true
          // break; // 将循环跳出
          breakNodeId.push(result);
        }
      }
    }
    if (!breakNodeId.length) { // 全部正确
      return true;
    }
    return breakNodeId;
  }
  // 流量节点判断  待完善
  judgMedia(item) {
    const timeType = ['IN', 'OUT'];    
    if (!item.data) {
      return item.id;
    }
    if (!item.data.mediaId) { // 媒体id
      return item.id;
    }
    if (!item.data.dealId) { // dealId
      return item.id;
    }
    // if (!item.data.sourceType) { // dealId
    //   return item.id;
    // }
    if (!item.data.givtSwitch) { // dealId
      return item.id;
    }
    if (item.data.dealType === 'PDB') {
      if (!item.data.material || !item.data.material.length) {
        return item.id;
      }
      if (_.isArray(item.data.material)) { // dealId
        for (let i = 0,material = item.data.material; i < material.length; i++) {
          if (!material[i].name){ // 素材名称  必填
            return item.id;
          }
          if (!material[i].timeType){ // 素材有效期必填
            return item.id;
          }
          if (!material[i].status){ // 素材状态
            return item.id;
          }
          if (timeType.indexOf(material[i].timeType) !== -1){ // ['IN', 'OUT'];
            if ( _.isArray(material[i].timeSet) === false ) { // 首先判断他是不是数组
              return item.id;
            }
            if (material[i].timeType === 'IN') {
              if (material[i].timeSet.length === 0) { // 在判断他的长度
                return item.id;
              }
            }
            if (!material[i].type) { // 必填
              return item.id;
            }
            if (material[i].type === 'BANNER' && material[i].img.length !== 1) { // type="BANNER"时  必填 长度=1
              return item.id;
            }
            if (material[i].type === 'VIDEO' && material[i].video.length !== 1) { // type="VIDEO"时  必填 长度=1
              return item.id;
            }
            if (!material[i].jumpUrl) { //必填  落地页
              return item.id;
            }
          }
        }
        const res = this.comJudgmaterial(item);
        if (res !== true) {
          return item.id;
        }
      }
    } else if (item.data.dealType === 'PD') {
      delete item.data.material;
    }
    return true;
  }
  // 共享流量
  judgShareMedia(item) {
    if (!item.data) {
      return item.id;
    }
    if (!item.data.dealId) { // 
      return item.id;
    }
    // if (!item.data.sourceType) { // 
    //   return item.id;
    // }
    if (!item.data.givtSwitch) { // 
      return item.id;
    }
    /* if (!item.data.excCampaignId) { // 换量波次
      return item.id;
    } */
    return true;
  }
  // 频次节点 
  judgFrequency(item) {
    if (!item.data) {
      return item.id;
    }
    if (!item.data.type) { // "MONTH/ALL/OTHER",//必填  月/全周期/自定义 
      return item.id;
    }
    if (!item.data.relation || !item.data.relation.length) {
      return item.id;
    }
    if (item.data.type === 'OTHER') { // type="OTHER"时，必填
      if (!item.data.dateRange || _.isArray(item.data.dateRange) === false || item.data.dateRange.length === 0) {
        return item.id;
      }
    }
    return true;
  }
  // 追频节点  
  judgFollow(item) {
    if (!item.data) {
      return item.id;
    }
    if (!item.data.relation || !item.data.relation.length) {
      return item.id;
    }
    return true;
  }
  // 地域节点
  judgArea(item) {
    if (!item.data) {
      return item.id;
    }
    return true;
  }
  // 人群节点
  judgCrowd(item) {
    if (!item.data) {
      return item.id;
    }
    return true;
  }
  // 标签节点
  judgLabel(item) {
    if (!item.data) {
      return item.id;
    }
    return true;
  }
  // 控量节点
  judgFlow(item) {
    if (!item.data) {
      return item.id;
    }
    if (!item.data.type) { //必填 控量周期 日/全周期/自定义
      return item.id;
    }
    if (!item.data.relation || !item.data.relation.length) {
      return item.id;
    }
    if (item.data.type === 'OTHER' ) { 
      if (!item.data.dateRange || !item.data.dateRange.length) {
        return item.id;
      }
    }
    return true;
  }
  // 日期节点
  judgDate(item) {
    if (!item.data) {
      return item.id;
    }
    return true;
  }
  // 时间节点 
  judgTime(item) {
    if (!item.data) {
      return item.id;
    }
    return true;
  }
  // IP节点
  judgIp(item) {
    if (!item.data) {
      return item.id;
    }
    return true;
  }
  // 预算节点
  judgBudget(item) {
    if (!item.data) {
      return item.id;
    }
    if (!item.data.relation || !item.data.relation.length) {
      return item.id;
    }
    if (!item.data.type) {
      return item.id;
    }
    return true;
  }
  // 流量分配节点
  judgFlowdis(item) {
    if (!item.data) {
      return item.id;
    }
    if (!item.data.type) {
      return item.id;
    }
    return true;
  }
  // 投放节点
  judgOrder(item) {
    const timeType = ['IN', 'OUT'];  
    if (!item.data) {
      return item.id;
    }
    if (!item.data.name) {
      return item.id;
    }
    /* if (!item.data.sort) { // ================================
      return item.id;
    } */
    if (!item.data.material || !item.data.material.length) {
      return item.id;
    }
    if (_.isArray(item.data.material)) { // dealId
      for (let i = 0,material = item.data.material; i < material.length; i++) {
        if (!material[i].name){ // 素材名称  必填
          return item.id;
        }
        if (!material[i].timeType){ // 素材有效期必填
          return item.id;
        }
        if (!material[i].status){ // 素材状态
          return item.id;
        }
        if (!material[i].dealId) { // 必填
          return item.id;
        }
        if (timeType.indexOf(material[i].timeType) !== -1){ // ['IN', 'OUT'];
          if ( _.isArray(material[i].timeSet) === false ) { // 首先判断他是不是数组
            return item.id;
          }
          if (material[i].timeType === 'IN') {
            if (material[i].timeSet.length === 0) { // 在判断他的长度
              return item.id;
            }
          }
          if (!material[i].type) { // 必填
            return item.id;
          }
          
          if (material[i].type === 'BANNER' && material[i].img.length !== 1) { // type="BANNER"时  必填 长度=1
            return item.id;
          }
          if (material[i].type === 'VIDEO' && material[i].video.length !== 1) { // type="VIDEO"时  必填 长度=1
            return item.id;
          }
          if (!material[i].jumpUrl) { //必填  落地页
            return item.id;
          }
        }
      }
      const res = this.comJudgmaterial(item);
      if (res !== true) {
        return item.id;
      }
    }
    return true;
  }
  // 分享节点
  judgShare(item) {
    if (!item.data) {
      return item.id;
    }
    if (!item.data.name) {
      return item.id;
    }
    // if (!item.data.status) {
    //   return item.id;
    // }
    if (!item.data.type) {
      return item.id;
    }
    return true;
  }

  // 流量节点 投放节点 素材判断
  comJudgmaterial(item) {
    for (let i = 0,material = item.data.material; i < material.length; i++) {
      if (material[i].type === 'NATIVE') {
        if (material[i].img.length || material[i].video.length) {
          if (material[i].img.length) {
            for (let k = 0, img = material[i].img; k < img.length; k++) {
              if (Object.keys(img).length === 0) {
                return item.id;
              }
              if (!img[k].linkUrl && !img[k].content) {
                return item.id;
              }
            }
          }
          if (material[i].video.length) {
            for (let k = 0, video = material[i].video; k < video.length; k++) {
              if (Object.keys(video).length === 0) {
                return item.id;
              }
              if (!video[k].linkUrl && !video[k].content) {
                return item.id;
              }
            }
          }
        } else {
          return item.id;
        }
      }
    }
    return true;
  }
  

  // 频次分叉  
  judgFrequencyFork(item) {
    if (!item.data) {
      return this.getParentId(item);
    }
    if (item.data.type === 'NORMAL') { // /频次范围
      if (!item.data.value) {
        return this.getParentId(item);
      }
      if (item.data.value.length) {
        if (_.head(item.data.value) > _.last(item.data.value)) {
          return this.getParentId(item);
        }
        if (!this.judgRange(item)) {
          return this.getParentId(item);
        }
      }
    }
    return true;
  }
  // 追频分叉
  judgFollowFork(item) {
    if (!item.data) {
      return this.getParentId(item);
    }
    if (item.data.type === 'NORMAL') { // /频次范围
      if (!item.data.value) {
        return this.getParentId(item);
      }
      if (item.data.value.length) {
        if (_.head(item.data.value) > _.last(item.data.value)) {
          return this.getParentId(item);
        }
        if (!this.judgRange(item)) {
          return this.getParentId(item);
        }
      }
    }
    return true;
  }
  // 地域分叉
  judgAreaFork(item) {
    if (!item.data) {
      return this.getParentId(item);
    }
    if (item.data.type === 'NORMAL') {
      if (!item.data.value || !item.data.valueName) {
        return this.getParentId(item);
      }
      // 有一个不是数组
      if (!_.isArray(item.data.value) || !_.isArray(item.data.valueName)) {
        return this.getParentId(item);
      }
      // 两个数组长度不一样
      if (item.data.value.length !== item.data.valueName.length) {
        return this.getParentId(item);
      }
      // 数组长度是0
      if (item.data.value.length === 0 || item.data.valueName.length === 0) {
        return this.getParentId(item);
      }
    }
    return true;
  }
  // 人群分叉  
  judgCrowdFork(item) {
    if (!item.data) {
      return this.getParentId(item);
    }
    if (item.data.type === 'NORMAL') {
      if (!item.data.value || _.isArray(item.data.value) === false || item.data.value.length === 0) {
        return this.getParentId(item);
      }
    }
    return true;
  }
  // 标签分叉
  judgLabelFork(item) {
    if (!item.data) {
      return this.getParentId(item);
    }
    if (item.data.type === 'NORMAL') {
      if (!item.data.value || _.isArray(item.data.value) === false || item.data.value.length === 0) {
        return this.getParentId(item);
      }
    }
    return true;
  }
  // 控量分叉
  judgFlowFork(item) {
    if (!item.data) {
      return this.getParentId(item);
    }
    if (item.data.type === 'NORMAL') {
      if (!item.data.value || _.isArray(item.data.value) === false || !item.data.value.length) {
        return this.getParentId(item);
      }
    }
    return true;
  }
  // 日期分叉
  judgDateFork(item) {
    if (!item.data) {
      return this.getParentId(item);
    }
    if (item.data.type === 'NORMAL') {
      if (!item.data.value || _.isArray(item.data.value) === false || !item.data.value.length) { // 必填  日期
        return this.getParentId(item);
      }
    }
    return true;
  }
  // 时间分叉
  judgTimeFork(item) {
    if (!item.data) {
      return this.getParentId(item);
    }
    if (item.data.type === 'NORMAL') {
      if (!item.data.value || _.isArray(item.data.value) === false || !item.data.value.length) {
        return this.getParentId(item);
      }
    }
    return true;
  }
  // Ip分叉
  judgIpFork(item) {
    if (!item.data) {
      return this.getParentId(item);
    }
    if (item.data.type === 'NORMAL') {
      if (!item.data.value || _.isArray(item.data.value) === false || !item.data.value.length) {
        return this.getParentId(item);
      }
      if (!item.data.valueName || _.isArray(item.data.valueName) === false || !item.data.valueName.length) {
        return this.getParentId(item);
      }
      if (item.data.value.length !== item.data.valueName.length) {
        return this.getParentId(item);
      }
    }
    return true;
  }
  // 预算分叉
  judgBudgetFork(item) {
    if (!item.data) {
      return this.getParentId(item);
    }
    if (item.data.type === 'NORMAL') {
      if (!item.data.value || _.isArray(item.data.value) === false || !item.data.value.length) {
        return this.getParentId(item);
      }
    }
    return true;
  }
  // 流量分配分叉
  judgFlowdisFork(item) {
    if (!item.data) {
      return this.getParentId(item);
    }
    if (item.data.type === 'NORMAL') {
      if (!item.data.value || _.isArray(item.data.value) === false || !item.data.value.length) {
        return this.getParentId(item);
      }
    }
    return true;
  }

  // 分叉节点有问题 找到当前节点的父级 因为是多个 故要去重  在save方法中去重去空
  getParentId(item) {
    const nodes = loadStore().nodes;
    const db = new DB('list', nodes, 'id');
    const parentNode = db.selectOne({id: item.pid});
    return parentNode.id;
  }

  // 判断范围
  judgRange(data) {
    const nodes = loadStore().nodes;
    const db = new DB('list', nodes, 'id');
    const peerList = db.select({pid: data.pid});
    for (let i = 0; i < peerList.length; i++) {
      if (peerList[i].id === data.id) {
        peerList.splice(i, 1);
        break;
      }
    }
    let valArr = [];
    peerList.forEach(ele => {
      valArr.push(ele.form.value);
    });
    for (let j = 0; j < valArr.length; j++) {
      if (_.head(data.data.value) >= _.head(valArr[j]) && _.head(data.data.value) <= _.last(valArr[j])){
        return this.getParentId(data);
      }
      if (_.last(data.data.value) >= _.head(valArr[j]) && _.last(data.data.value) <= _.last(valArr[j])) {
        return this.getParentId(data);
      }
    }

    return true;
  }

  
}
export default ProcessingData;
