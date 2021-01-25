/**
 * @file 环境变量
 * @author svon.me@gmail.com
 */

const production = require('./production');

const data = Object.assign(production, {
  quclouds: 'http://qtest.core.myrtb.net/basis/config?secretkey=E3yN5mGvl4UgwQK7'
});

module.exports = data;