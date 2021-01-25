/**
 * @file 获取当前页面对应的数据
 * @author svon.me@gmail.com
 */

import _ from 'lodash';
import React from 'react';
import DB from '@fengqiaogang/dblist';
import * as config from 'src/routers/config';
import safeGet from '@fengqiaogang/safe-get';

export interface MenuData extends config.routerItem {
  [key: string]: any;
}

export interface MenuSelected {
  openKeys: string[],
  selectedKeys: string[],
}

export class Router<Props, State> extends React.Component<Props, State> {
  db = new DB([], 'id', 'pid', '0')
  constructor(props: any) {
    super(props);
    const list = this.db.flatten<MenuData>(config.routerMenus, 'children');
    this.db.insert(list);
  }
  protected getKeyToPathName(key: string): string {
    return safeGet<string>(config.routers, key);
  }
  // 根据 key 获取数据
  protected getSelectKeys(key: string): MenuSelected {
    if (key) {
      const list = this.db.parentDeepFlatten<MenuData>({ key });
      const curl = _.last(list);
      if (curl) {
        const parents = list.slice(0, -1);
        const selectedKeys = _.map([].concat(curl), item => item.id);
        const openKeys = _.map(parents, item => item.id);
        return { openKeys, selectedKeys };
      }
    }
    return { openKeys: [], selectedKeys: [] };
  }
  protected curPathNameKey(pathname: string): string {
    const fun = function (prefix: string[], routers: any): string {
      for (const key in routers) {
        const value = routers[key];
        if (_.isString(value)) {
          if (value === pathname) {
            return [].concat(prefix, key).join('.');
          }
        } else if (_.isObject(value)) {
          const temp = fun([].concat(prefix, key), value);
          if (temp) {
            return temp;
          }
        }
      }
      return void 0;
    };
    const key = fun([], config.routers);
    return key;
  }
  // 根据路由 path 获取路由 key
  protected pathnameToKey(pathname: string): string {
    let key = this.curPathNameKey(pathname);
    const item = this.db.selectOne<MenuData>({ key });
    // 如果该页面没有对应的菜单
    if (item && item.hidden) {
      // 返回父级菜单
      const parents = this.db.parentDeepFlatten<MenuData>(item);
      for(let i = parents.length - 1; i >= 0; i--) {
        const temp = parents[i];
        if (temp.hidden) {
          continue;
        } else {
          key = temp.key;
          break;
        }
      }
    }
    return key;
  }
}

