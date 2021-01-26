/**
 * @file 路由配置
 */

/**
 * 定义路由
 * 定义路由时不要使用 param(/aa/:id) 模式，因为需要使用路径来匹配菜单选中项
 * 参数传递使用 query(?id=1) 模式
 */
export const routers = {
  dashboard: '/',
  demo: {
    '1': '/demo/1',
    '2': '/demo/2',
    '3': '/demo/3'
  },
  goods: {
    list: '/good/list',  // 商品列表
    create: '/goods/create', // 商品创建
    edit: '/goods/edit', // 商品编辑
  },
  order: {
    list: '/order', // 订单列表
    info: '/order/info',  // 订单详情
    service: {
      detail: '/order/service/detail', // 订单详情
      apply: '/order/service/apply',   //申请
      audit: '/order/service/audit',   //审核
      refund: '/order/service/refund'  //退款
    },
  },
  test: {
    in: '/test/in', // 注入
    study: '/test/study', // 注入
  },
  shop:{
    set:'/shop/set' //首页轮播配置
  },
  earnings: {
    earningsList: '/earnings/list'
  },
  live:{
    list:'/live/list', //直播列表
    add:'/live/add' //添加主播
  },
  system: {
    group: {
      info: '/system/group/info',
      share: '/system/group/share',
      service: '/system/group/service'
    }
  }
};

export interface routerItem {
  name: string;
  key: string;
  icon?: string;
  hidden?: boolean;
  children?: routerItem[];
}

// 菜单
export const routerMenus = [
  {
    name: '首页',
    key: 'dashboard', // 通过 key 可以从 routers 获取 path 路径
  },
  // {
  //   name: '测试',
  //   key: 'demo',
  //   children: [
  //     {
  //       name: '测试1',
  //       key: 'demo.1',
  //     }, {
  //       name: '测试2',
  //       key: 'demo.2',
  //     }, {
  //       name: '测试3',
  //       key: 'demo.3',
  //     }
  //   ]
  // },
  {
    name: '商品管理',
    key: 'goods',
    icon: 'icongoods',
    children: [
      {
        name: '商品列表',
        key: 'goods.list',
        children: [
          {
            name: '添加商品',
            hidden: true, // 该页面为商品列表子页面，不需要显示到菜单中
            key: 'goods.create',
          },
          {
            name: '编辑商品',
            hidden: true, // 该页面为商品列表子页面，不需要显示到菜单中
            key: 'goods.edit',
          }
        ]
      },
    ]
  },
  {
    name: '订单管理',
    key: 'order',
    icon: 'iconorder',
    children: [
      {
        name: '订单列表',
        key: 'order.list',
        children: [
          // 订单列表中的订单详情
          {
            name: '订单详情',
            hidden: true,
            key: 'order.info',
          },
          // 申请详情下的订单详情
          {
            name: '订单详情',
            hidden: true,
            key: 'order.service.detail',
          },
          {
            name: '申请详情',
            hidden: true,
            key: 'order.service.apply',
          },
          {
            name: '审核处理',
            hidden: true,
            key: 'order.service.audit',
          },
          {
            name: '退款处理',
            hidden: true,
            key: 'order.service.refund',
          },
        ]
      },
      
    ]
  },
  {
    name:'商城配置',
    key:'shop',
    icon:'iconorder',
    children:[
      {
        name:'商城页面配置',
        key:'shop.set'
      }
    ]
  },
  {
    name: 'test',
    key: 'test',
    icon: 'iconorder',
    children: [
      {
        name: '注入',
        key: 'test.in'
      },
      {
        name: '学习',
        key: 'test.study'
      }
    ]
  },
  {
    name: '收益管理',
    key: 'earnings',
    icon: 'iconorder',
    children: [{
      name: '收入列表',
      key: 'earnings.earningsList'
    }]
  },
  {
    name:'主播管理',
    key:'live',
    icon:'iconorder',
    children:[
      {
        name:'主播列表',
        key:'live.list',
        children: [
          {
            name: '添加主播',
            hidden: true, // 该页面为商品列表子页面，不需要显示到菜单中
            key: 'live.add',
          },
        ]
      }
    ]
  },
  {
    name: '系统管理',
    key: 'system',
    icon: 'iconsetting',
    children: [{
      name: '商户设置',
      key: 'system.group.info',
      children: [
        {
          name: '分享信息',
          key: 'system.group.share',
          hidden: true,
        }, {
          name: '售后设置',
          key: 'system.group.service',
          hidden: true,
        }
      ]
    }]
  }
];
