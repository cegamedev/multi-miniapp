# 聚合项目类工程

### 简介： 将许多小项目统一放到这里，支持多个app同时打包，输出相互独立的app，自动识别vue框架单页面和多页面类型的app以及非前端框架类app，支持环境变量，共享公共组件及service等能复用的资源。  

#
## 常用命令

安装
```
yarn install
```

本地启动某个app
```
yarn serve --app=jxb // 启动vue框架单页面app
yarn serve --app=multi_pages --multi // 启动vue框架多页面app
```

编译多个app
```
yarn build // 编译全部app
yarn build --apps=jxb // 编译某一个app
yarn build --apps='jxb jxx' // 编译某几个app
```

按环境编译
```
yarn build // 编译线上环境
yarn build:test // 编译测试环境
yarn build:dev // 编译开发环境
```

组合编译
```
yarn build // 编译线上环境全部app
yarn build:test --apps=jxb // 编译测试环境某个app
yarn build:dev --apps='jxb jxx' // 编译开发环境某几个app
```

#
## 单页面app

### 本地启动

- 单页面app启动无需携带参数
```
yarn serve --app=jxb // 启动某个vue框架单页面app
```

### 编译

- 这里没有特殊参数设置，参考上面常用命令编译说明。

### 目录约定

“src->apps”  
- apps目录下只允许放各个app，其他文件不允许存放  
- 编译时脚本会获取apps下的目录列表，即app列表，然后根据目录列表逐个编译  

“public”  
- app的html模板文件主要存放在public目录下
- 每个app的html模板命名规则是：${appName}.index.html  

“dist”
- dist目录为编译输出目录，按各个app划分
- 编译某个app时，只替换dist下当前app内容，其他app内容不会更新

#
## 多页面app

### 本地启动

- 如果是多页面，启动命令要带上 --multi  
```
yarn serve --app=jxb --multi // 启动多页面app
```
- 启动后，可以访问某个页面  
例如：http://localhost:8080/mapDaka.html

### 编译

- 这里没有特殊参数设置，参考上面常用命令编译说明。
- 编译时脚本会自动判断是否是多页面app，如果是那么包含哪些页面，编译时整个过程自动处理，不需要手动增加编译参数。

### 目录约定  

“apps->app”
- app目录下只允许放页面目录和tpl目录，其他文件不允许存放。
- tpl目录只允许存放各个页面模板，其他文件不允许存放。
- 编译时脚本会根据tpl目录判断该app属于多页面类型，然后根据目录里的模板生成对应的页面。所以多页面app必须包含tpl目录，tpl目录只有页面模板，不应该再添加其他文件。
- 注意：单页面app不能有tpl目录。

#
## 非前端框架类app

### 本地启动

- 目前不支持本地启动和热重载，后续完善

### 编译

- 这里没有特殊参数设置，参考上面常用命令编译说明。
- 编译时脚本会自动判断是否是非前端框架类app，不需要手动增加编译参数。

### 目录约定  

“apps->app”
- app目录下必须有ejs目录，里面存放编译模板ejs文件
- 编译时脚本会根据ejs目录判断该app属于非前端框架类型，然后根据目录里的模板生成对应的页面。所以非前端框架类app必须包含ejs目录，目录内必须是index.ejs。目前不支持自定义命名以及多个ejs文件，后续完善。
- 注意：单页面app不能有tpl目录和ejs目录，tpl目录只能在多页面app中存在，ejs目录只能在非前端框架类app存在。

#
## 工程环境变量 
.env.builddev 编译开发环境变量  
.env.buildtest 编译测试环境变量  
.env.production 编译线上环境变量  
.env.development 本地启动环境变量  

### 环境变量命名约定
- app环境变量，变量名必须带上当前app名称，代表该变量只属于当前app  
 如：multi_pages工程，VUE_APP_MULTI_PAGES_PUBLIC_PATH = '/dataStatistics'
- 全局环境变量，变量名不需要带app名称，代表该变量属于所有app
- 非前端框架类app目前不支持环境变量，后续完善

#
## 注意
- vue框架类app打包基于vue-cli@4，非前端框架类app打包基于原生webpack，由于vue-cli内部用的是css-loader@3.2.0，所以为了兼顾vue-cli，webpack打包依赖的css-loader版本要统一。其他loader及插件为发现兼容问题。
- 非前端框架类app目前不支持以下功能：  
1，多模板多页面编译，目前ejs目录下只允许放index.ejs  
2，统一环境变量，目前没有使用到环境变量  
3，本地启动及热重载，目前只有编译命令  


