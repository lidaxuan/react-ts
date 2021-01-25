/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-10-22 09:38:20
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-11-03 15:32:20
 * @FilePath: /decision-web/src/transfer/index.js
 */
var transferObj = {
  page: null,
  contextMenu: null,
  G6Editor: null,
  itemPanel: null,
  Minimap: null,
  // 获取 this
  getPageThis(data) {
    this.page = data;
  },
  getContextMenuThis(data) {
    this.contextMenu = data;
  },
  getG6EditorThis(data) {
    this.G6Editor = data;
  },
  // page.vue 方法
  transferMuliteSelectEnd(nodesId) {
    this.G6Editor.muliteSelectEnd(nodesId);
  },
  transferClickNodeEmitNodeId(e) {
    this.page.clickNodeEmitNodeId(e);
  },
  // contextMenu.vue 方法
  // 节点的右键事件 因 Mac 不生效 在 handle.js 重写
  transferContextmenuClick(model) {
    this.contextMenu.contextmenuClick(this.editXY(model));
  },
  // 线的 右键事件
  transferOnContexEdgetmenu(model) {
    this.contextMenu.onContexEdgetmenu(this.editXY(model));
  },
  // 鼠标落下
  transferMousedown(model) {
    this.contextMenu.mousedown(model);
  },
  // 画布右键事件 拖拽
  transferOnCanvasContextmenu(model) {
    this.contextMenu.canvasContextmenu(this.editXY(model));
  },
  // G6Editor
  transferUpdateItem(model) {
    this.G6Editor.updateItem(model);
  },
  transferAddItem(model) {
    this.G6Editor.addEdgeItem(model);
  },
  // 移动节点
  transferMoveGroupNodes(nodes, e, origin) {
    this.G6Editor.moveGroupNodes(nodes, e, origin);
  },
  transferMouseover(e) {
    this.contextMenu.nodeMouseover(e);
  },
  transferMouseleave(e) {
    this.contextMenu.nodeMouseleave(e);
  },
  editXY(model) {
    // model.clientX = model.clientX;
    // model.clientY = model.clientY;
    return model;
  }
};

export default transferObj;
