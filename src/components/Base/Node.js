/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-08-13 14:32:26
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-08-13 14:43:45
 * @FilePath: /decision-web/src/components/Base/Node.js
 */
class Node extends Object{
  constructor(params) {
    super();
    this.id = params.id;

    for (let key in params) {
      this[key] = params[key] || 0;
    }
    this.size = params.size.split('*');
    this.parent = params.parent;  // 所属组  
    this.index = params.index; // 渲染层级 
  }
}
export default Node;