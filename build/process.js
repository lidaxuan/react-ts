/**
 * @file 环境变量信息
 * @author svon.me@gmail.com
 */

const _ = require('lodash');
const webpack = require('webpack');
const getConfig = require('./config');

const processValue = function(env) {
  const config = getConfig(env);
  const result = {};
  _.each(config, function (value, key) {
    result[key] = `"${value}"`;
  });
  return result;
};

const getProcess = function (env) {
  const value = processValue(env);
  return [
    new webpack.DefinePlugin({
      'process.env': value
    }),
  ];
};

module.exports = {
  value: processValue,
  plugin: getProcess
};