/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-08-13 14:32:26
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-08-13 14:41:48
 * @FilePath: /decision-web/src/behavior/keyboard.js
 */
// import eventBus from "../utils/eventBus";
export default {
  getDefaultCfg() {
    return {
      backKeyCode: 8,
      deleteKeyCode: 46
    };
  },
  getEvents() {
    return {
      keyup: 'onKeyUp',
      keydown: 'onKeyDown'
    };
  },

  onKeyDown(e) {
    const code = e.keyCode || e.which;
    switch (code) {
    case this.deleteKeyCode:
    case this.backKeyCode:
      // eventBus.$emit('deleteItem');
      break;
    }
  },
  onKeyUp() {
    this.keydown = false;
  }
};
