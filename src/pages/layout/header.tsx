/**
 * @file 系统顶部内容
 * @author svon.me@gmail.com
 */

import React, { Component } from 'react';
import logo from 'static/images/logo.png';
import { Row, Col, Menu, Dropdown } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { getUser } from 'src/model/user/index';
import { Config, getConfig } from 'src/utils/quclouds';
import process from 'src/env/index';

interface User {
  avatar?: string;
  nickname?: string;
  mobile?: number | string;
  [key: string]: any;
}

class Header extends Component<any, User> {
  state = {}
  // 当组建在页面上加载后调用
  async componentDidMount () {
    try {
      const user: User = await getUser();
      if (user) {
        this.setState(user);
      }
    } catch (error) {
      // todo
    }
  }
  private getMenu1Content(): React.ReactElement {
    return void 0;
  }
  private getMenu2Content(config: Config): React.ReactElement {
    const signOut = `${config.domains.core}/user/sign/out?redirect=${process.env.domain}`;
    const center = config.domains.center;
    return (<Menu>
      <Menu.Item>
        <a className="dibk" href={ center }>
          <span className="font-12">账户管理</span>
        </a>
      </Menu.Item>
      <Menu.Item>
        <a className="dibk" href={ signOut }>
          <span className="font-12">退出</span>
        </a>
      </Menu.Item>
    </Menu>);
  }
  private getAvatar (state: User, config: Config): React.ReactNode {
    if (state.avatar && config) {
      const src = `${config.api.host}/${state.avatar}`;
      return (<img className="dibk portrait" src={ src }/>);
    }
    return void 0;
  }
  private getTitle (): React.ReactNode {
    const menu = this.getMenu1Content();
    if (menu) {
      return (<Dropdown overlay={ menu }>
        <div>
          <b className="font-black font-16">XXXXXXXX</b>
          <CaretDownOutlined />
        </div>
      </Dropdown>);
    }
    return (<div>
      <b className="font-black font-16">XXXXXXXX</b>
    </div>);
  }
  render () {
    const state: User = this.state;
    const config = getConfig();
    return (<Row className="hmax">
      <Col span={12} className="hmax pl20">
        <div className="flex flex-aic hmax">
          <div className="pr5">
            {/* <img className="logo" src={ logo }/> */}
          </div>
          { this.getTitle() }
        </div>
      </Col>
      <Col span={12} className="hmax pr40">
        <div className="hmax flex flex-aic flex-jcend">
          <Dropdown overlay={this.getMenu2Content(config)}>
            <div>
              <span className="dibk">
                { this.getAvatar(state, config) }
              </span>
              <span className="dibk ml10">{ state.nickname ? state.nickname : state.mobile }</span>
            </div>
          </Dropdown>
        </div>
      </Col>
    </Row>);
  }
}

export default Header;
