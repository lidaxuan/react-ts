# React


## 环境信息

```
测试环境域名:  http://devliveadmin.myrtb.net

本地环境域名:  http://devlivemanage.myrtb.net:8080
本地环境需要配置 hosts  127.0.0.1 devlivemanage.myrtb.net
```


## Nginx 配置

```
server {
  location / {
    try_files $uri /index.html
  }
}
```

### antd

国内镜像: https://ant-design.gitee.io/index-cn

### antd ui(theme)

```
参考 https://git.quclouds.com:8443/qsj.quyun/qlivemanagetheme
```

### react-router

5.2 文档: https://blog.csdn.net/weixin_30872499/article/details/101076819?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control

## IconFont 

```
import IconFont from 'src/components/icon/index';
// type 是 icon 的名称
<IconFont type="iconmenu"></IconFont>
// 需要调整大小
<IconFont className="font-16" type="iconmenu"></IconFont>
```
