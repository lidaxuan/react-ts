/**
 * @file sass 处理
 * @author svon.me@gmail.com
 */

const _ = require('lodash');
const getDir = require('./dir');
const getConfig = require('./config');

const functionFile = 'src/styles/function.scss';

// 默认从那个目录导入文件
const includePaths = function() {
  const dir = getDir();
  return [].concat(dir);
};

const scssData = function (env) {
  const config = getConfig(env);
  const text = [
    `@import "${functionFile}";`
  ];
  _.each(config, function (value, key) {
    const name = '$' + key;
    text.push(`${name}: "${value}";`);
  });
  const code = text.join('\n');
  return code;
};


module.exports = {
  data: scssData,
  includePaths: includePaths
};