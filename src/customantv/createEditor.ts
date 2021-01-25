/*
 * @Description: 初始化g6
 * @Author: 李继玄（15201002062@163.com）
 * @Date: 2021-01-24 14:58:31
 * @FilePath: /react-ts-antvg6/src/customantv/createEditor.ts
 */

import G6 from "@antv/g6";
import customNode from './customNode';

const COLLAPSE_ICON = function COLLAPSE_ICON(x, y, r) {
  return [
    ['M', x - r, y],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x - r + 4, y],
    ['L', x - r + 2 * r - 4, y],
  ];
};
const EXPAND_ICON = function EXPAND_ICON(x, y, r) {
  return [
    ['M', x - r, y],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x - r + 4, y],
    ['L', x - r + 2 * r - 4, y],
    ['M', x - r + r, y - r + 4],
    ['L', x, y + r - 4],
  ];
};

const ICON_MAP = {
  a: 'https://gw.alipayobjects.com/mdn/rms_8fd2eb/afts/img/A*0HC-SawWYUoAAAAAAAAAAABkARQnAQ',
  b: 'https://gw.alipayobjects.com/mdn/rms_8fd2eb/afts/img/A*sxK0RJ1UhNkAAAAAAAAAAABkARQnAQ',
};



class CreateEditor {
  data: Array<any>;
  graph: any;
  width: number | string;
  height: number | string;
  constructor(data: Array<any>, width?, height?) {
    this.data = data;
    this.width = width || 800;
    this.height = height || 800;
  }
  init() {
    this.graph = new G6.Graph({
      container: "container",
      width: this.width,
      height: this.height,
      defaultNode: {
        size: [100],
        shape: 'modelRect',
        labelCfg: {
          style: {
            fill: '#000000A6',
            fontSize: 20
          }
        },
        style: {
          stroke: '#72CC4A',
          width: 150
        }
      },
      defaultEdge: {
        style: {
          shape: 'custom-edge',
          lineWidth: 2,
          endArrow: {
            // 自定义箭头指向(0, 0)，尾部朝向 x 轴正方向的 path
            path: 'M 0,0 L 20,10 L 20,-10 Z',
            // 箭头的偏移量，负值代表向 x 轴正方向移动
            // d: -10,
            // v3.4.1 后支持各样式属性
            fill: '#333',
            stroke: '#666',
            opacity: 0.8,
            // ...
          },
          stroke: "#333"
        }
      },
      // default: [
      //   {
      //     type: 'drag-node',
      //     enableDelegate: true,
      //     shouldBegin: (e) => {
      //       // 不允许拖拽 id 为 'node1' 的节点
      //       if (e.item && e.item.getModel().id === 'node1') return false;
      //     },
      //   },
      //   {
      //     type: 'node:mouseenter',
      //     enableDelegate: true,
      //     shouldBegin: (e) => {
      //       // 不允许拖拽 id 为 'node1' 的节点
      //       console.log(11111);

      //     },
      //   },
      // ],
      modes: {
        // default: ['drag-canvas', 'drag-node', 'drag-combo'],
        // 支持的 behavior
        // default: ['drag-canvas', 'zoom-canvas'],
        default: ['drag-canvas', 'drag-node', 'drag-combo', 'name', 'create-edge'],
        edit: ['click-select'],
      },
      linkPoints: {
        top: false,
        right: true,
        bottom: true,
        left: true,
        // circle的大小
        size: 3,
        lineWidth: 1,
        fill: '#72CC4A',
        stroke: '#72CC4A',
      },
    } as any);
    this.eventfn();
    this.graph.data(this.data);
    this.graph.render();
  }
  // 自定义节点
  registerNodeFn(): void {
    G6.registerNode("modelRect", {
      drawShape: function drawShape(cfg, group) {
        const color = cfg.error ? '#F4664A' : '#30BF78';
        const r = 2;
        console.log(cfg);
        const shape = group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: 200,
            height: 60,
            stroke: color,
            radius: r
          },
          name: 'main-box',
          draggable: true,
        });
    
        group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: 200,
            height: 20,
            fill: color,
            radius: [r, r, 0, 0],
          },
          name: 'title-box',
          draggable: true,
        });
    
        // 左侧图标
        group.addShape('image', {
          attrs: {
            x: 4,
            y: 2,
            height: 16,
            width: 16,
            cursor: 'pointer',
            img: ICON_MAP[cfg.nodeType || 'app'],
          },
          name: 'node-icon',
        });
    
        // 标题
        group.addShape('text', {
          attrs: {
            textBaseline: 'top',
            y: 2,
            x: 24,
            lineHeight: 20,
            text: cfg.title,
            fill: '#fff',
          },
          name: 'title'
        });
    
    
        // 增加右边 marker
        group.addShape('marker', {
          attrs: {
            x: 184,
            y: 30,
            r: 6,
            cursor: 'pointer',
            symbol: cfg.collapse ? EXPAND_ICON : COLLAPSE_ICON,
            stroke: '#666',
            lineWidth: 1,
          },
          name: 'collapse-icon',
        });
    
        // 增加左边 marker
        group.addShape('marker', {
          attrs: {
            x: 0,
            y: 30,
            r: 6,
            cursor: 'pointer',
            symbol: cfg.collapse ? EXPAND_ICON : COLLAPSE_ICON,
            stroke: '#666',
            lineWidth: 1,
          },
          name: 'collapse-icon',
        });
    
        // 增加上边 marker
        group.addShape('marker', {
          attrs: {
            x: 90,
            y: 0,
            r: 6,
            cursor: 'pointer',
            symbol: cfg.collapse ? EXPAND_ICON : COLLAPSE_ICON,
            stroke: '#666',
            lineWidth: 1,
          },
          name: 'collapse-icon',
        });
        
        // 节点中的内容列表
        cfg.panels.forEach((item, index) => {
          // 名称
          group.addShape('text', {
            attrs: {
              textBaseline: 'top',
              y: 25,
              x: 24 + index * 60,
              lineHeight: 20,
              text: item.title,
              fill: 'rgba(0,0,0, 0.4)',
            },
            name: `index-title-${index}`,
            draggable: true,
          });
    
          // 值
          group.addShape('text', {
            attrs: {
              textBaseline: 'top',
              y: 42,
              x: 24 + index * 60,
              lineHeight: 20,
              text: item.value,
              fill: '#595959',
            },
            name: `index-title-${index}`,
            draggable: true,
          });
    
        });
        return shape;
      },
      setState(name, value, item) {
        if (name === 'collapsed') {
          const marker = item.get('group').find((ele) => ele.get('name') === 'collapse-icon');
          const icon = value ? G6.Marker.expand : G6.Marker.collapse;
          marker.attr('symbol', icon);
        }
      }
    } as any);
  }
  // 自定义线
  registerEdgeFn(): void {
    G6.registerEdge(
      'custom-edge',
      {
        // 响应状态变化
        setState(name, value, item) {
          console.log(name);
          
          const group = item.getContainer();
          const shape = group.get('children')[0]; // 顺序根据 draw 时确定
          if (name === 'active') {
            if (value) {
              shape.attr('stroke', 'red');
            } else {
              shape.attr('stroke', '#333');
            }
          }
          if (name === 'selected') {
            if (value) {
              shape.attr('lineWidth', 6);
            } else {
              shape.attr('lineWidth', 2);
            }
          }
        },
      },
      'cubic-vertical',
    );
  }
  eventfn() {
    this.graph.on('node:mouseenter', e => {
      // 一些操作
      const item = e.item;
      let group;
      if (item && item.getContainer) {
        group = item.getContainer();
      }
      if (!group) {
        return;
      }
      this.graph.setItemState(item, 'hover', true);
      group.find(g => {
        // g.attr("fill", "#pink");
        // g.attr('opacity', 1);
        // e.target.attr("cursor", "crosshair");
      });
    });
    this.graph.on('node:mouseout', e => {
      // 一些操作
      const item = e.item;
      let group;
      if (item && item.getContainer) {
        group = item.getContainer();
      }
      if (!group) {
        return;
      }
      this.graph.setItemState(item, 'hover', false);

      group.find(g => {
        // g.attr("fill", "#blue");
        // g.attr('opacity', 0);
        // e.target.attr("cursor", "none");
      });
    });
    this.graph.on('edge:mouseenter', (ev) => {
      const edge = ev.item;
      this.graph.setItemState(edge, 'active', true);
    });
    
    this.graph.on('edge:mouseleave', (ev) => {
      const edge = ev.item;
      this.graph.setItemState(edge, 'active', false);
    });
    this.graph.on('node:dragend', (ev) => {
      const edge = ev.item;
      console.log(ev);
      
      this.graph.setItemState(edge, 'active', false);
    });
    this.graph.on('node:click', (e) => {
      console.log(e);
      // return;
      console.log(e.target.get('name'));
      
      if (e.target.get('name') === 'collapse-icon') {
        e.item.getModel().collapsed = !e.item.getModel().collapsed;
        this.graph.setItemState(e.item, 'collapsed', e.item.getModel().collapsed);
        this.graph.layout();
      }
    });
    this.graph.on('aftercreateedge', (e) => {
      const edges = this.graph.save().edges;
      G6.Util.processParallelEdges(edges);
      this.graph.getEdges().forEach((edge, i) => {
        this.graph.updateItem(edge, edges[i]);
      });
    });
  }
}
export default CreateEditor;