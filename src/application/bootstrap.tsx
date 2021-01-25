/*
 * @Description: 
 * @Author: 李继玄（15201002062@163.com）
 * @Date: 2020-12-29 13:45:23
 * @FilePath: /react-ts-antvg6/src/application/bootstrap.tsx
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


import Main from './main';
import React from 'react';
import { render } from 'react-dom';
import { setConfig } from 'src/utils/quclouds';
import { getUser } from 'src/model/user/index';
import { updateSession } from 'src/utils/user';
import { getQuCloudsConfig } from 'src/model/config/quclouds';

const bootstrap = async function(): void {
  try {
    // 获取趣系列配置信息
    const config = await getQuCloudsConfig();
    // 存储配置信息
    setConfig(config);
    // 获取用户信息
    // const user = await getUser();
    const user = {
      agent: 0,
      avatar: "uploads/qualifications/2020/10/27/64077b11e5941f1f199310eb7d02a748.png",
      bind_email_status: 1,
      bind_mobile_status: 2,
      certificate_status: 3,
      company_name: "测试1号22",
      created_at: 1587629301,
      default_org: {path: [], name: [], new_org_name: ["测试接口名称"]},
      email: "",
      groupStatus: 0,
      id: 661,
      ip_address: "127.0.0.1",
      is_zzy: 1,
      mobile: "18511894274",
      nickname: "DJ-葫芦兄弟",
      organization_arr: "[[688]]",
      parent_id: 0,
      position: "",
      role_id: 1,
      scale: 1,
      status: 1,
      type: 1,
      typeName: "广告主",
      unReadNum: 4,
    };
    
    // 如果用户信息为空，则认为未登录
    if (!user) {
      // 跳转到登录页面
      const href = `${config.domains.core}/user/sign/in?redirect=${window.location.href}`;
      console.log(href);
      
      // window.location.href = href;
      return false;
    }
  } catch (error) {
    console.log(error);
    // todo
  }
  updateSession(); // 更新一次用户令牌信息
  render(<Main/>, document.getElementById('app'));
};

// 利用 settimeout 会将需要执行的函数放到队列最后执行
// 以实现 window.onload 同等效果
setTimeout(bootstrap);

// 开启热加载模式
if (module.hot) {
  module.hot.accept(function () {
    console.log('hot');
  });
}