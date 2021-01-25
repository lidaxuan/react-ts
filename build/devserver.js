/* jshint esversion: 6 */
/*
 * @Description: 
 * @Author: 李继玄（15201002062@163.com）
 * @Date: 2021-01-05 16:34:17
 * @FilePath: /react-ts-antvg6/build/devserver.js
 */
/**
 * @file webpack 配置
 */

const getConfig = require('./config');
const webpackConfig = require('./webpack');

async function main(env) {
  const data = await Promise.resolve(webpackConfig(env));
  const config = getConfig(env);
  const option = {
    devServer: {
      clientLogLevel: 'warning',
      contentBase: false,
      compress: true,
      inline: true,
      hot: true, //实时刷新
      publicPath: '/',
      historyApiFallback: {
        rewrites: [
          { from: /.*/, to: '/index.html' },
        ]
      },
      hotOnly: true,
      progress: true,
      host: '127.0.0.1',
      port: config.port || 80,
      disableHostCheck: true,
      // public: `${config.domain}:${config.port || 80}`
    }
  };
  return Promise.resolve(Object.assign({}, data, option));
}

module.exports = main;