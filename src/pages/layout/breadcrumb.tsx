/**
 * @file 面包屑
 * @author svon.me@gmail.com
 */

import _ from 'lodash';
import React from 'react';
import * as Antd from 'antd';
import * as routers from './router';
import { browserHistory, Link } from 'react-router';

export default class Breadcrumb extends routers.Router<any, any> {
  private getLocation() {
    const location = browserHistory.getCurrentLocation();
    return location;
  }
  private getMenus(): Array<routers.MenuData> {
    const location = this.getLocation();
    const routerKey = this.curPathNameKey(location.pathname);
    const where = {
      key: routerKey
    };
    const parents = this.db.parentDeepFlatten<routers.MenuData>(where);
    return parents.slice(1);
  }
  private getBreadcrumbItem(item: routers.MenuData): React.ReactNode {
    const location = this.getLocation();
    const url = this.getKeyToPathName(item.key);
    if (location.pathname === url) {
      return (<span>{ item.name }</span>);
    }
    const to = { pathname: url };
    return (<Link to={ to }>{ item.name }</Link>);
  }
  private getBreadcrumbNodes(list: Array<routers.MenuData>): React.ReactNode {
    return (<Antd.Breadcrumb>
      {
        _.map(list, (item: routers.MenuData, index: number) => {
          return (<Antd.Breadcrumb.Item key={ index }>
            { this.getBreadcrumbItem(item) }
          </Antd.Breadcrumb.Item>);
        })
      }
    </Antd.Breadcrumb>);
  }
  render() {
    const list = this.getMenus();
    if (list.length > 0) {
      return (<div className="layout-breadcrumb flex flex-aic">
        { this.getBreadcrumbNodes(list) }
      </div>);
    }
    // 空节点
    return <></>;
  }
}