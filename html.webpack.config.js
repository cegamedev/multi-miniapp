/**
 * 需要完善的几点：
 * 多页面编译
 * 统一环境变量
 * 支持本地启动
 * 支持热更新
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
require('colors');
const yargs = require('yargs');

// 获取参数
const { argv } = yargs;

// 编译对象
const appName = argv.app;
if (!appName) {
  throw new Error(`编译对象不能为空：${appName}`);
}

console.log('当前正在编译：'.green,appName.yellow);

const publicPath = './';
const appPath = `${__dirname}/src/apps/${appName}`;

module.exports = {
  entry: {
    sigle: `${appPath}/main.js`,
  },
  output: {
    path: `${__dirname}/dist/${appName}`,
    publicPath,
    filename: '[name]-[chunkhash].js' 
  },
  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: [MiniCssExtractPlugin.loader,'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attributes: {
              list: [
                {
                  attribute: 'src',
                  type: 'src',
                  filter: (a,b,c,d)=>{
                    return true;
                  }
                },
                {
                  attribute: 'data-src',
                  type: 'src',
                },
              ],
            },
          }
        }
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // todo 多个页面可以继续加HtmlWebpackPlugin实例，后续可以扩展完善
    new HtmlWebpackPlugin({
      template: `${appPath}/ejs/index.ejs`,
      inject: true,
      staticPath: `${publicPath}static/`,
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[chunkhash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${appPath}/static`,
          to: 'static',
        }
      ]
    })
  ]
}