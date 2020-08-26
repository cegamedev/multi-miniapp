const path = require('path');
const yargs = require('yargs');
const fs = require("fs");
require("colors");

// 获取参数
const { argv } = yargs;

// 编译对象
const appName = argv.app;
if (!appName) {
  throw new Error(`编译对象不能为空：${appName}`);
}

console.log('当前正在编译：'.green,appName.yellow);

// 该app是多页面吗，构造pages
const multi = argv.multi;

let pages = {};
if (multi) {
  let tplNames = [];
  const appFiles = fs.readdirSync(`./src/apps/${appName}`);
  if (appFiles.includes('tpl')) {
    tplNames = fs.readdirSync(`./src/apps/${appName}/tpl`).map((tplName) => {
      return path.parse(tplName).name;
    });
    if (tplNames.length <= 0) {
      throw new Error(`tpl目录不能为空：${tplNames}`);
    }
  }

  for (let i = 0; i < tplNames.length; i++) {
    let tempIndex = {
      entry: `src/apps/${appName}/${tplNames[i]}/main.js`,
      template: `src/apps/${appName}/tpl/${tplNames[i]}.html`,
      filename: `${tplNames[i]}.html`,
    };
    pages[`index${i}`] = tempIndex;
  }
}
else {
  pages = {
    index: {
      entry: `src/apps/${appName}/main.js`,
      template: `public/${appName}.index.html`,
      filename: `index.html`,
    }
  };
}

console.log('编译入口：'.green, pages)

// 读取工程配置
// 该app输出的根路径  默认是/ 如果你的网站是app.com/vue 更改此配置项为“/vue”
const publicPath = process.env[`VUE_APP_${appName.toUpperCase()}_PUBLIC_PATH`] || '/';
const projConfs = {
  publicPath
};
console.log('工程配置：'.green,projConfs);

module.exports = {
  publicPath,

  // 构建输出目录
  outputDir: `dist/${appName}`,

  // 静态资源目录(js,css,img,fonts)
  assetsDir: 'assets',

  // 是否开启eslint保存检测,有效值: true || false || 'error'
  lintOnSave: false,

  devServer: {
    open: true, // 是否自动弹出
    host: '0.0.0.0',
    port: 8080, // 端口
    https: false,
    hotOnly: true, // 热更新
    proxy: {
      '/ss': {
        target: 'http://iotadmin.susoncloud.cn',
        // target: 'http://192.168.0.177:8080',
        // target: 'http://192.168.0.124:8080',
        // target: 'http://192.168.0.152:8080',

        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/ss': '',
        },
      },
    },
  },

  // chainWebpack: (config) => {
  //   config
  //     .entry('./src/main.js')
  //     .add('babel-polyfill');
  // },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 'primary-color': '#EC1917',
          // 'menu-highlight-color': '#EC1917',
          // 'menu-item-active-bg': '#FDEDED',
        },
        javascriptEnabled: true,
      },
    },
  },

  /**
   * todo 关于全局样式覆盖问题
   * antd的样式覆盖两种方式：
   * 1，如果在main.js中import进来，则用上面的modifyVars覆盖有效；
   * 2，如果用下面的方式覆盖虽然有效，但会有些问题，建议用第一种方式覆盖；
   *
   * */
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        // path.resolve(__dirname, 'node_modules/ant-design-vue/dist/*.less'),
        path.resolve(__dirname, 'src/assets/*.less'),
      ],
    },
  },

  pages,

};
