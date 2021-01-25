/* jshint esversion: 6 */
/*
 * @Description: 
 * @Author: 李继玄（15201002062@163.com）
 * @Date: 2021-01-24 15:21:48
 * @FilePath: /react-ts-antvg6/src/model/editor/index.ts
 */

export const getData = function () {
  const arr = [
    {
      "name": "频次控制",
      "label": "频次控制",
      "size": [
        98,
        98
      ],
      "type": "node",
      "nodeType": "FREQUENCY",
      "x": 228,
      "y": 74,
      "shape": "customNode",
      "color": "#1890ff",
      "backImage": "/static/img/frequencyControl.60307043.svg",
      "inPoints": [
        [
          0,
          0.5
        ]
      ],
      "outPoints": [
        [
          1,
          0.5
        ]
      ],
      "showFlag": true,
      "isCollapseShape": true,
      "offsetX": 37,
      "offsetY": 30,
      "id": "5a79ada05e1511ebb4c5e95d3705ea2c"
    },
    {
      "name": "人群定向",
      "label": "人群定向",
      "size": [
        98,
        98
      ],
      "type": "node",
      "nodeType": "CROWD",
      "x": 370,
      "y": 240,
      "shape": "customNode",
      "color": "#1890ff",
      "backImage": "/static/img/crowd.d841da10.svg",
      "inPoints": [
        [
          0,
          0.5
        ]
      ],
      "outPoints": [
        [
          1,
          0.5
        ]
      ],
      "showFlag": true,
      "isCollapseShape": true,
      "offsetX": 24,
      "offsetY": 30,
      "id": "5d956c905e1511ebb4c5e95d3705ea2c"
    }
  ];
  
  const data = {
    nodes: [
      {
        id: '1',
        title: 'Task1',
        error: true,
        panels: [
          { title: 'Proc', value: '11%' },
          { title: 'Time', value: '20s' },
          { title: 'Err', value: 'N' }
        ],
        type: 'modelRect',
        x: 300,
        y: 50
      },
      {
        id: '2',
        title: 'Task2',
        error: true,
        panels: [
          { title: 'Proc', value: '11%' },
          { title: 'Time', value: '20s' },
          { title: 'Err', value: 'N' }
        ],
        type: 'modelRect',
        x: 150,
        y: 300,
      },
      {
        id: '3',
        title: 'Task3',
        error: false,      
        panels: [
          { title: 'Proc', value: '11%' },
          { title: 'Time', value: '20s' },
          { title: 'Err', value: 'N' }
        ], 
        type: 'modelRect',
        x: 450,
        y: 300
      },
    ],
    edges: [
      {
        source: '1',
        target: '2',
        data: {
          type: '',
          amount: "",
          date: ''
        },
        type: 'custom-edge'
      },
      {
        source: '1',
        target: '3',
        data: {
          type: '',
          amount: '',
          date: ''
        },
        type: 'custom-edge'
      },
    ],
  };
  return data as any;
};