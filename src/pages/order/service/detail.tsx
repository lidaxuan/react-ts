/*
 * @Author: MrZhang
 * @Date: 2021-01-05 09:49:18
 * @Description: 订单详情
 */

import React from 'react';
import ServiceGroup, { Labels } from './common';
import _ from 'lodash';
import Info from '../info';


export default class SystemDetail extends ServiceGroup<any, any> {
  formSpaceName = 'SystemGroupInfo'
  constructor(props: any) {
    super(props);
  }
  getRadioValue(): Labels {
    return Labels.detail;
  }
  
  getContent(): React.ReactNode {
    return (<Info {...this.props}></Info>);
  }
}

