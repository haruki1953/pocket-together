## change-case 插件
https://marketplace.visualstudio.com/items?itemName=wmaurer.change-case

快速更改当前选择或当前单词的命名规则

## 让VScode浮窗显示完整的ts类型定义
https://github.com/microsoft/vscode/issues/64566#issuecomment-2199018004

1. 使用 Ctrl+P，转到 `node_modules/typescript/lib/tsserver.js`
    - 没有的话，找到 `node_modules/typescript/lib/tsc.js`
    - 还没有的话，找到 `node_modules/typescript/lib/typescript.js`
2. 查找行 `var defaultMaximumTruncationLength = 160`
3. 将其更改为 `1600` 或您选择的价值。
4. 打开 Ctrl+Shift+P 菜单，选择 TypeScript：选择 TypeScript 版本...
5. 确保将其设置为“使用工作区版本”
6. 完全重新启动 VSCode - 重新加载工作区是不够的。
7. 验证...缩写已从类型提示中消失。