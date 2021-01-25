/*
 * @Description: 
 * @Author: 李继玄（15201002062@163.com）
 * @Date: 2021-01-21 09:40:52
 * @FilePath: /react-ts-antvg6/src/routers/index.tsx
 */
/**
 * @file 路由定义
 * @author svon.me@gmail.com
 */

import React from 'react';
import * as config from './config';
// 实现异步组件
import asnyc from 'src/utils/async';
import Layout from 'src/pages/layout/index';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

// 路由变化时触发
const onUpdate = function (): void {
  // todo
  // const location = browserHistory.getCurrentLocation();
  // console.log(location);
  if (window.location.pathname === '/') {
    window.location.href = `/demo1`;
  }
};

// const goodsList = asnyc(() => import('src/pages/goods/goodlist'));

const Routers: React.FC = function (): React.ReactElement {
  return (<Router history={browserHistory} onUpdate={onUpdate}>
    <Route path={config.routers.dashboard} component={Layout}>
      <IndexRoute component={asnyc(() => import('src/pages/dashboard/index'))}></IndexRoute>
      <Route path="/demo1" component={ asnyc(() => import('src/pages/antv/index'))}></Route>
      {/* <Route path='/demo1' component={ asnyc(() => import('src/test/demo1/index')) }></Route>
      <Route path='/demo2' component={ asnyc(() => import('src/test/demo4/p')) }></Route>
      <Route path='/demo3' component={ asnyc(() => import('src/test/demo3/index')) }></Route> */}
      <Route path={ config.routers.goods.list } component={ asnyc(() => import('src/pages/goods/index')) }></Route>
      <Route path={config.routers.order.list} component={asnyc(() => import('src/pages/order/list'))}></Route>
      <Route path={config.routers.order.info} component={asnyc(() => import('src/pages/order/info'))}></Route>
      <Route path={config.routers.goods.create} component={asnyc(() => import('src/pages/goods/operation'))}></Route>
      <Route path={config.routers.goods.edit} component={asnyc(() => import('src/pages/goods/operation'))}></Route>
      <Route path={config.routers.earnings.earningsList} component={asnyc(() => import('src/pages/earnings/index'))}></Route>
      <Route path={config.routers.system.group.info} component={asnyc(() => import('src/pages/system/group/index'))}></Route>
      <Route path={config.routers.system.group.share} component={asnyc(() => import('src/pages/system/group/share'))}></Route>
      <Route path={config.routers.system.group.service} component={asnyc(() => import('src/pages/system/group/service'))}></Route>
      <Route path={config.routers.order.service.detail} component={asnyc(() => import('src/pages/order/service/detail'))}></Route>
      <Route path={config.routers.order.service.apply} component={asnyc(() => import('src/pages/order/service/apply'))}></Route>
      <Route path={config.routers.order.service.audit} component={asnyc(() => import('src/pages/order/service/audit'))}></Route>
      <Route path={config.routers.order.service.refund} component={asnyc(() => import('src/pages/order/service/refund'))}></Route>
      <Route path={config.routers.shop.set} component={asnyc(() => import('src/pages/shop/set'))}></Route>
      <Route path={config.routers.live.list} component={asnyc(() => import('src/pages/live/list'))}></Route>
      <Route path={config.routers.live.add} component={asnyc(() => import('src/pages/live/add'))}></Route>
      <Route path="*" component={asnyc(() => import('src/pages/dashboard/index'))} />
    </Route>
  </Router>);
};

export default Routers;