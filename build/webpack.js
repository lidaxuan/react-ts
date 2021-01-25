// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

const _ = require('lodash');
const getDir = require('./dir');
const getMode = require('./mode');
const getProcess = require('./process');
const getSass = require('./sass');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const getOutput = function (env) {
  const dist = getDir('dist', env.mode);
  return {
    output: {
      path: dist,
      filename: '[name].js',
      publicPath: '/'
    }
  };
};

const main = function (env) {
  const option = _.assign({}, getMode(env), getOutput(env));
  return {
    ...option,
    entry: {
      app: [
        getDir('src/styles/css.scss'),
        getDir('src/styles/antd/theme.css'),
        getDir('src/application/bootstrap'),
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".d.ts"],
      alias: {
        'src': getDir('src'),
        'static': getDir('static')
      }
    },
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.(t|j)s?x?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'eslint-loader',
            }
          ]
        },
        {
          test: /\.(t|j)s?x?$/,
          use: [
            {
              loader: 'ts-loader'
            }
          ],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
          ]
        },
        {
          test: /\.scss$/,
          include: [
            getDir('src')
          ],
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader', //?sourceMap&minimize
            },
            {
              loader: 'postcss-loader',
              // options: {
              //   sourceMap: sourceMap
              // }
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: getSass.includePaths(env),
                },
                additionalData: getSass.data(env),
                // sassOptions: {
                // }
              }
            },
          ]
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            // {
            //   loader: "style-loader"
            // },
            {
              loader: 'css-loader'
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: true,
                lessOptions: {
                  modifyVars: {
                    '@primary-color': '#13c2c2',　　//修改antd主题色
                  },
                  javascriptEnabled: true,
                }
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                publicPath: '/',
                context: getDir('static'),
                // name: '[hash].[ext]'
                // name: '[path][name].[ext]'
                // name: '[path][name].[ext]?[hash]'
                name: '[path][name].[ext]?hash=[sha512:hash:base64:7]'
              }
            },
          ],
        },
        // {
        //   test: /\.(png|jpe?g|gif)$/,
        //   use: [
        //     {
        //       loader: 'url-loader',
        //       options: {
        //         limit: 5000
        //       }
        //     }
        //   ]
        // }
      ]
    },
    externals: {
      "lodash": "_",
      // "react": "React",
      // "react-dom": "ReactDOM",
      // "react-router": "ReactRouter",
      // "react-router-dom": "ReactRouterDOM",
    },
    performance: {
      hints:'warning',
      //入口起点的最大体积
      maxEntrypointSize: 1024 * 1024 * 50,
      //生成文件的最大体积
      maxAssetSize: 1024 * 1024 * 50,
      //只给出 js 文件的性能提示
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js');
      }
    },
    optimization: {
      splitChunks: {
        chunks: 'async',
        minSize: 20000,
      }
    },
    plugins: [].concat(getProcess.plugin(env), [
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: getDir('public/index.html'),
        filename: 'index.html',
      }),
    ]),
  };
};

module.exports = main;