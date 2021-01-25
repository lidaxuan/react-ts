/**
 * @file 处理项目跟目录
 * @author svon.me@gmail.com
 */

const path = require('path');

const getDir = function (...args) {
  const root = path.join(__dirname, '..');
  if (args.length) {
    const arr = [].concat(root, args);
    return path.join(...arr);
  }
  return root;
};

module.exports = getDir;