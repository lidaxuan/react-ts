// import eventBus from "../utils/eventBus";

import transferObj from '../transfer';

export default {
  getEvents() {
    return {
      // 'node:contextmenu': 'onContextmenu', // 用户在节点上右击鼠标时触发并打开右键菜单
      'edge:contextmenu': 'onContexEdgetmenu', // 用户在边上右击鼠标时触发并打开右键菜单
      'canvas:contextmenu': 'onCanvasContextmenu', // 用户在边上右击鼠标时触发并打开右键菜单
      'mousedown': 'onMousedown',
      // 'canvas:click': 'onCanvasClick'
    };
  },
  // onContextmenu(e) {
  //   console.log(1);
    
  //   transferObj.transferContextmenuClick(e);
  // },
  onContexEdgetmenu(e) {
    transferObj.transferOnContexEdgetmenu(e);
  },
  onMousedown(e) {
    transferObj.transferMousedown(e);
  },
  // page 画布右键点击
  onCanvasContextmenu(e) {
    transferObj.transferOnCanvasContextmenu(e);
  },
};
