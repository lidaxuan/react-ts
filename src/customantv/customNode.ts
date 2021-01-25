/*
 * @Description: 自定义节点
 * @Author: 李继玄（15201002062@163.com）
 * @Date: 2021-01-24 16:07:29
 * @FilePath: /react-ts-antvg6/src/customantv/customNode.ts
 */
import G6, { Shape } from "@antv/g6";
import { v4 as uniqueId } from 'uuid';
import safeGet from '@fengqiaogang/safe-get';
import conditionImg from '../static/images/logo.png';

const customNode = {
  init() {
    console.log(1);
    
    G6.registerNode("customNode", {
      
      draw(cfg, group) {
        console.log('====', cfg);
        if (!cfg.showFlag) {
          return;
        }
        let size = cfg.size;
        if (!size) {
          size = [98, 98];
        }

        // 此处必须是NUMBER 不然bbox不正常
        const width = parseInt(size[0]);
        const height = parseInt(size[1]);
        // 此处必须有偏移 不然drag-node错位
        const offsetX = -width / 2;
        const offsetY = -height / 2;
        const mainId = 'rect' + uniqueId();
        let shape = null;
        shape = group.addShape("rect", { // 背景
          attrs: {
            id: mainId,
            x: offsetX,
            y: offsetY,
            width: width,
            height: height,
            stroke: "transparent", // #ced4d9
            fill: 'transparent',//此处必须有fill 不然不能触发事件 #E5FBED
            radius: 2 // width / 2
          }
        });
        group.addShape("text", {
          attrs: {
            id: 'label' + uniqueId(),
            x: offsetX,
            y: offsetY,
            textAlign: "center",
            textBaseline: "middle",
            text: "李大玄",
            parent: mainId,
            fill: "#565758"
          }
        });
        // group.addShape("image", {
        //   attrs: {
        //     x: offsetX,
        //     y: offsetY,
        //     width: 26,
        //     height: 26,
        //     img: conditionImg,
        //   }
        // });

        // 添加文本、更多图形
        return shape;
      },
      //设置状态
      setState(name, value, item) {
        console.log(name, value, item);
        
      }
    }, 'rect');
  }
};

export default customNode;
