/* jshint esversion: 6 */
/*
 * @Description: 
 * @Author: 李继玄（15201002062@163.com）
 * @Date: 2021-01-14 10:40:58
 * @FilePath: /decision-web/src/command/formattingData.js
 */
import _ from 'lodash';
import * as flowModel from '@/model/flowNode';
import svgIcons from '@/components/Base/svgs.js';
import DB from '@fengqiaogang/dblist';
import safeSet from '@fengqiaogang/safe-set';

async function getFlowList() {
  let obj = {};
  let list = await flowModel.getFlowList();
  list.forEach(ele => {
    obj[ele.id] = ele.backImage;
  });
  return obj;
}

/**
 * @method 讲述数据格式化,返回新数据
 * @param {*} data 需要格式化的值
 */
export async  function formatting(data) {
  const flowObj = await getFlowList();
  let params = {};
  let copyData = _.cloneDeep(data); //  讲数据进行拷贝 
  delete copyData.detail;
  params.baseInfo = copyData;
  let nodes = data.detail || [];
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].isCollapseShape = true;
    nodes[i].showFlag = true;
    nodes[i].shape = 'customNode';
    nodes[i].backImage = flowObj[nodes[i].data.mediaId];
    nodes[i].form = _.cloneDeep(nodes[i].data); // 将data转存
    delete nodes[i].data;
    if (nodes[i].nodeType === 'FORK') {
      nodes[i].size = [26, 26];
    } else {
      nodes[i].size = [98, 98];
    }
    if (nodes[i].pid !== '-1' && _.isArray(nodes[i].pid) === false) {
      nodes[i].pid = nodes[i].pid.split(',');
    }
    if (!nodes[i].backImage) {
      nodes[i].backImage = svgIcons[nodes[i]['nodeType']];
      if (nodes[i]['nodeType'] === 'ORDER') {
        if (nodes[i].form.status === 'OPEN') {
          nodes[i].backImage = svgIcons.ORDER;
        } else if  (nodes[i].form.status === 'CLOSE') {
          nodes[i].backImage = svgIcons.CLOSE_ORDER_Img;
        }
      }
    }
    if (nodes[i].nodeType === 'ORDER') {
      nodes[i].closeImg = svgIcons.CLOSE_ORDER_Img;
      nodes[i].openImg = svgIcons.ORDER;
    }
  }
  const db = new DB('db list', nodes, 'id', 'pid');
  const budgetNodes = db.select({nodeType: 'BUDGET'}); // 拿到预算节点
  const budgetIds = _.map(budgetNodes, item => { // 拿到预算节点ID
    return item.id;
  });
  const budgetForkNode = db.select({pid: budgetIds}); // 查找分叉
  for (let i = 0; i < budgetForkNode.length; i++) { // 修改数据
    let len = budgetForkNode[i].form.value || [];
    for (let k = 0; k < len.length; k++) {
      const value = budgetForkNode[i].form.value[k] ? budgetForkNode[i].form.value[k] / 100 : 0;
      safeSet(budgetForkNode[i], `form.value[${k}]`, value);
    }
  }
  params.nodes = nodes;
  return params;
}
