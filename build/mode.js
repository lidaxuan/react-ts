/**
 * @file 处理 webpack mod
 * @author svon.me@gmail.com
 */

const _ = require('lodash');

const getMode = function (env) {
  let mode = env.mode;
  if (_.includes(['development', 'production'], mode) === false) {
    mode = 'development';
  }
  const devtool = mode === 'development' ? 'cheap-eval-module-source-map' : false;
  // const devtool = 'cheap-eval-module-source-map';
  return { mode, devtool };
};

module.exports = getMode;