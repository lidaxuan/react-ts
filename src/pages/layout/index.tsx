/**
 * @file 项目布局
 * @author svon.me@gmail.com
 */

import Sider from './sider';
import Header from './header';
import Breadcrumb from './breadcrumb';
import React, { Children } from 'react';
import IconFont from 'src/components/icon/index';


interface Props {
  children: React.ReactElement | Array<React.ReactElement>;
  [key: string]: any;
}

interface State {
  fold: boolean;
}

class Layout extends React.Component<Props, State> {
  state = {
    fold: false
  }
  constructor(props: any) {
    super(props);
    this.onChangeFoldStatus = this.onChangeFoldStatus.bind(this);
  }
  private getLayoutClassName(): string {
    const name = ['app-layout-main'];
    if (this.state.fold) {
      name.push('fold');
    }
    return name.join(' ');
  }
  private onChangeFoldStatus(): void {
    const fold = !this.state.fold;
    this.setState({ fold });
  }
  render(): React.ReactElement {
    if (this.props.children) {
      return (<div className="app-layout">
        <div className="header-box">
          <Header></Header>
        </div>
        <div className={ this.getLayoutClassName() }>
          <div className="app-layout-sider">
            <div className="sider-box">
              <div className="flex flex-jcc flex-aic sider-menu" onClick={ this.onChangeFoldStatus }>
                <IconFont className="font-16" type="iconmenu"></IconFont>
              </div>
              <Sider fold={ this.state.fold }></Sider>
            </div>
          </div>
          <div className="app-layout-body">
            <Breadcrumb></Breadcrumb>
            <div className="p10">
              <div className="p20 app-layout-content">
                {
                  Children.map(this.props.children, child => child)
                }
              </div>
            </div>
          </div>
        </div>
      </div>);
    } else {
      // 异常时
      // return (<Redirect to='/404'/>);
      return (<div>404</div>);
    }
  }
}

export default Layout;

