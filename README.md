# PocketTogether

项目结构
```
pocketbase 后端
vue3 前端
vitepress 文档
note 笔记
scripts 用于 项目启动、项目构建 的一些脚本
```

## pocketbase 后端
下载 PocketBase
```
从官网或github下载预先构建的最小 PocketBase 可执行文件：
解压后复制其中的 pocketbase.exe 到 pocketbase\pocketbase.exe

本项目使用的版本是 v0.28.2
https://github.com/pocketbase/pocketbase/releases/tag/v0.28.2

官网 https://pocketbase.io/docs/
github https://github.com/pocketbase/pocketbase
```

启动 PocketBase
```
运行 pocketbase\start.bat 或 pocketbase\start.sh 来启动 pocketbase
```

关于 `pocketbase\pb_schema.json`
```
这个是自己在设置好项目所需的集合（collections）后手动导出的集合信息，pocketbase的运行并不依赖与这个
自己将这个导出的意义是，可以让git更好地记录集合信息及其变化
pb_schema.json 还有一个作用是，可以使用 pocketbase-typegen 生成ts类型以便前端使用（有多种方式生成）

pocketbase-typegen https://www.npmjs.com/package/pocketbase-typegen
```

## vue3 前端
用 vscode 打开 vue3 目录进行开发。
> 不要在项目根目录（此文件所在目录）开发，会让eslint报错
