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

## 将小型字体base64嵌入css提高加载速度
```css
/* vue3\src\assets\styles\nunito.css */
/* Nunito latin */
@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  /* src: url(https://fonts.gstatic.com/s/nunito/v31/XRXI3I6Li01BKofiOc5wtlZ2di8HDLshdTQ3jw.woff2) format('woff2'); */
  src: url('data:font/woff2;base64,AAABAAEAEBAAAAAABAA...') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* 文件转base64命令 */
/* base64 XRXI3I6Li01BKofiOc5wtlZ2di8HDLshdTQ3jw.woff2 > output.txt */
```
