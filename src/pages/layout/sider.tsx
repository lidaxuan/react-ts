/**
 * @file 系统左侧菜单
 * @author svon.me@gmail.com
 */

import _ from 'lodash';
import React from 'react';
import { Menu } from 'antd';
import * as routers from './router';
import { browserHistory } from 'react-router';
import IconFont from 'src/components/icon/index';

interface Props {
  fold?: boolean;
}


class Sider extends routers.Router<Props, any> {
  constructor(props: any) {
    super(props);
    this.onClickMenuItem = this.onClickMenuItem.bind(this);
  }
  private onClickMenuItem(e: any): void {
    const data = this.db.selectOne<routers.MenuData>({ id: e.key });
    const pathname = this.getKeyToPathName(data.key);
    browserHistory.push(pathname);
  }
  private getLabel(text: string): React.ReactNode {
    return (<span className="font-14 font-black middle">{text}</span>);
  }
  private getName(text: string): React.ReactNode {
    return (<span className="font-14">{text}</span>);
  }
  private getSubMenuItem(data: routers.MenuData): React.ReactNode {
    const name = this.getName(data.name);

    return (<Menu.Item onClick={this.onClickMenuItem} key={data.id}>{name}</Menu.Item>);
  }
  private getSubMenu(data: routers.MenuData): React.ReactNode {
    const where = {
      id: data.id
    };
    const list = this.db.children<routers.MenuData>(where);
    if (_.size(list) > 0) {
      const icon = data.icon ? (<IconFont className="font-24 middle" type={data.icon}></IconFont>) : void 0;
      return (<Menu.SubMenu key={data.id} icon={icon} title={this.getLabel(data.name)}>
        {
          _.map(list, (item: routers.MenuData) => {
            return this.getSubMenuItem(item);
          })
        }
      </Menu.SubMenu>);
    } else {
      return this.getSubMenuItem(data);
    }
  }
  render() {
    const list = this.db.select<routers.MenuData>({ pid: '0' }); // 查询第一层菜单名称
    const location = browserHistory.getCurrentLocation();
    
    const routerKey = this.pathnameToKey(location.pathname);
    
    const state = this.getSelectKeys(routerKey);
    
    return (<Menu mode="inline" inlineCollapsed={ this.props.fold } defaultSelectedKeys={ state.selectedKeys } defaultOpenKeys={ state.openKeys }>
      {
        _.map(list, (item: routers.MenuData) => {
          return this.getSubMenu(item);
        })
      }
    </Menu>);
  }
}


export default Sider;
