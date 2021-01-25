/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-07-17 14:50:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-14 10:09:33
 * @FilePath: /decision-web/src/command/enum.js
 */ 
export const baseNodeType = ['FREQUENCY', 'FOLLOW', 'AREA', 'CROWD', 'LABEL', 'FLOW', 'DATE', 'TIME', 'IP', 'BUDGET', 'FLOWDIS', 'SHARE'];


// 基础节点 并且都是可添加分叉节点
export const baseType = ['FREQUENCY', 'FOLLOW', 'AREA', 'CROWD', 'LABEL', 'FLOW', 'DATE', 'TIME', 'IP', 'BUDGET', 'FLOWDIS'];

/**                       媒体      共享流量     流量分配   投放节点  分享节点*/
export const nodeType = ['MEDIA', 'SHAREMEDIA', 'FLOWDIS', 'ORDER', 'SHARE'];
/**                                    频次          追频      控量     预算 */
export const judgRelationNodeType = ['FREQUENCY', 'FOLLOW', 'FLOW', 'BUDGET'];