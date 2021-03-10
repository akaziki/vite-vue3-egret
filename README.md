# vite+vue3集成egret引擎游戏

> 该项目为使用vite+vue3集成egret引擎的一个示例，可实现无需打开egret Wing运行server，自动监听egret内容变化，开发egret体验更为流畅

### 新建egret项目

1. 打开egretlauncher
2. 点击项目-创建项目（如果还没安装引擎会提示先下载安装一个引擎，使用最新版本的引擎即可）
3. 点击egretlauncher——工具，安装 egret compiler

### 新建vite-vue项目

```shell
 npm init @vitejs/app vue-egret --template vue
 cd vue-egret
 npm i
```

### 拷贝egret项目到vue项目的根目录

### 删除egret目录下无用文件和目录

.wing、bin-debug、favicon.ico、index.html、manifest.json

### 添加文件

#### egret目录

1. EgretGame.vue：挂载egret游戏的组件
2. egretScriptLoader.js：加载白鹭js代码的类

####根目录 

1. gameWatcher.js：export default 出一个gameWatcher,gameWatcher.init()用作vite.cofing.js的server.watch属性的值，主要负责监听egret目录内的文件变化，重新生成default.res.json文件和重新编译打包egret的代码到public/game目录下

### 修改egret/scripts/config.ts

> 执行egret build命令时会默认使用此config，修改里面的buildConfig方法，将打包的outputDir设置为public/game

### 修改vite.config.js

>  Ï添加option:server.watch监听egret目录变化

### 修改egret/src/Main.ts

loadResource方法的读取资源文件的路径

```typescript
await RES.loadConfig("default.res.json", "game/resource/");
```

### 修改src/App.vue

> 引入EgretGame组件、引入egretScriptLoader
>
> 执行egretScriptLoader.loadEgret方法，并在该Promise 完成后的then方法里面调用egret.runEgret

### 修改package.json

添加一个script，用于打包vite项目前执行打包egret项目

```json
{
"p": "egret publish ./egret && npm run build"
}

```

### 安装一些依赖并添加到package.json

```shell
 npm i --save-dev chokidar cross-spawn
 npm i --save axios 
```

### 将public/game添加到.gitignore中

### 本地运行

```shell
npm run dev
```

### 打包

```shell
npm run p
```



