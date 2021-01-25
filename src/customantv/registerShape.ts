import G6 from '@antv/g6'
import insertCss from 'insert-css';

insertCss(`
  #contextMenu {
    position: absolute;
    list-style-type: none;
    padding: 10px 8px;
    left: -150px;
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
  }
  #contextMenu li {
    cursor: pointer;
		list-style-type:none;
    list-style: none;
    margin-left: 0px;
  }
  #contextMenu li:hover {
    color: #aaa;
  }
`);


const ERROR_COLOR = '#F5222D';
const getNodeConfig = node => {
  if (node.nodeError) {
    return {
      basicColor: ERROR_COLOR,
      fontColor: '#FFF',
      borderColor: ERROR_COLOR,
      bgColor: '#E66A6C',
    };
  }
  let config = {
    basicColor: '#5B8FF9',
    fontColor: '#5B8FF9',
    borderColor: '#5B8FF9',
    bgColor: '#C6E5FF',
  };
  switch (node.type) {
    case 'root': {
      config = {
        basicColor: '#E3E6E8',
        fontColor: 'rgba(0,0,0,0.85)',
        borderColor: '#E3E6E8',
        bgColor: '#5b8ff9',
      };
      break;
    }
    default:
      break;
  }
  return config;
};

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
}


G6.registerNode('pipeline-node', {
  drawShape: function drawShape(cfg, group) {
    const color = cfg.error ? '#F4664A' : '#30BF78'
    const r = 2;
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

    // 增加下边 marker
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
        name: `index-title-${index}`
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
        name: `index-title-${index}`
      });

    });
    return shape;
  },
},
  'single-node'
);
// const colorMap = {
//   'name1': '#72CC4A',
//   'name2': '#1A91FF',
//   'name3': '#FFAA15'
// }

// G6.registerNode('node', {
//     drawShape: function drawShape(cfg, group) {
//       const width = cfg.style.width;
//       const stroke = cfg.style.stroke;
//       const rect = group.addShape('rect', {
//         attrs: {
//           x: -width / 2,
//           y: -15,
//           width,
//           height: 30,
//           radius: 15,
//           stroke,
//           lineWidth: 0.6,
//           fillOpacity: 1,
//           fill: '#fff'
//         }
//       });
//       const point1 = group.addShape('circle', {
//         attrs: {
//           x: -width / 2,
//           y: 0,
//           r: 3,
//           fill: stroke
//         }
//       });
//       const point2 = group.addShape('circle', {
//         attrs: {
//           x: width / 2,
//           y: 0,
//           r: 3,
//           fill: stroke
//         }
//       });
//       return rect;
//     },
//     getAnchorPoints: function getAnchorPoints() {
//       return [[0, 0.5], [1, 0.5]];
//     },
//     update: function (cfg, item) {
//       const group = item.getContainer()
//       const children = group.get('children')
//       const node = children[0]
//       const circleLeft = children[1]
//       const circleRight = children[2]

//       const {style: {stroke}, labelStyle} = cfg

//       if (stroke) {
//         node.attr('stroke', stroke)
//         circleLeft.attr('fill', stroke)
//         circleRight.attr('fill', stroke)
//       }
//     }
//   },
//   'single-shape'
// );

// G6.registerEdge('polyline', {
//   itemType: 'edge',
//   draw: function draw(cfg, group) {
//     const startPoint = cfg.startPoint;
//     const endPoint = cfg.endPoint;

//     const Ydiff = endPoint.y - startPoint.y;

//     const slope = Ydiff !== 0 ? 500 / Math.abs(Ydiff) : 0;

//     const cpOffset = 16;
//     const offset = Ydiff < 0 ? cpOffset : -cpOffset;

//     const line1EndPoint = {
//       x: startPoint.x + slope,
//       y: endPoint.y + offset
//     };
//     const line2StartPoint = {
//       x: line1EndPoint.x + cpOffset,
//       y: endPoint.y
//     };

//     // 控制点坐标
//     const controlPoint = {
//       x:
//       ((line1EndPoint.x - startPoint.x) * (endPoint.y - startPoint.y)) /
//       (line1EndPoint.y - startPoint.y) +
//       startPoint.x,
//       y: endPoint.y
//     };

//     let path = [
//       ['M', startPoint.x, startPoint.y],
//       ['L', line1EndPoint.x, line1EndPoint.y],
//       [
//         'Q',
//         controlPoint.x,
//         controlPoint.y,
//         line2StartPoint.x,
//         line2StartPoint.y
//       ],
//       ['L', endPoint.x, endPoint.y]
//     ];

//     if (Ydiff === 0) {
//       path = [
//         ['M', startPoint.x, startPoint.y],
//         ['L', endPoint.x, endPoint.y]
//       ];
//     }

//     const line = group.addShape('path', {
//       attrs: {
//         path,
//         stroke: colorMap[cfg.data.type],
//         lineWidth: 1.2,
//         endArrow: false
//       }
//     });

//     const labelLeftOffset = 8;
//     const labelTopOffset = 8;
//     // amount
//     const amount = group.addShape('text', {
//       attrs: {
//         text: cfg.data.amount,
//         x: line2StartPoint.x + labelLeftOffset,
//         y: endPoint.y - labelTopOffset - 2,
//         fontSize: 14,
//         textAlign: 'left',
//         textBaseline: 'middle',
//         fill: '#000000D9'
//       }
//     });
//     // type
//     const type = group.addShape('text', {
//       attrs: {
//         text: cfg.data.type,
//         x: line2StartPoint.x + labelLeftOffset,
//         y: endPoint.y - labelTopOffset - amount.getBBox().height - 2,
//         fontSize: 10,
//         textAlign: 'left',
//         textBaseline: 'middle',
//         fill: '#000000D9'
//       }
//     });
//     // date
//     const date = group.addShape('text', {
//       attrs: {
//         text: cfg.data.date,
//         x: line2StartPoint.x + labelLeftOffset,
//         y: endPoint.y + labelTopOffset + 4,
//         fontSize: 12,
//         fontWeight: 300,
//         textAlign: 'left',
//         textBaseline: 'middle',
//         fill: '#000000D9'
//       }
//     });
//     return line;
//   }
// });