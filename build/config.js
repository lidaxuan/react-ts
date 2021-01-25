/**
 * @file 获取配置文件信息
 * @author svon.me@gmai.com
 */

const _ = require('lodash');
const getDir = require('./dir');
const getMode = require('./mode');

const getConfig = function (env) {
  const { mode } = getMode(env);
  const data = require(getDir(`config/${env.mode}`));
  const result = {
    mode: mode
  };
  _.each(data, function (value, key) {
    result[key] = value;
  });
  return result;
};

module.exports = getConfig;