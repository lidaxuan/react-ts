/**
 * @file 环境变量
 * @author svon.me@gmail.com
 */

const production = require('./production');

const data = Object.assign(production, {
  port: 8080,
  domain: 'devlivemanage.myrtb.net',
  quclouds: 'http://qdev.core.myrtb.net/basis/config?secretkey=E3yN5mGvl4UgwQK7'
});

module.exports = data;