## 让变量有tailwind提示
```json
  // .vscode\settings.json
  // https://github.com/tailwindlabs/tailwindcss/discussions/7554#discussioncomment-3030988
  // vscode://settings/tailwindCSS.classAttributes
  "tailwindCSS.classAttributes": [
    "class",
    "className",
    "ngClass",
    "class:list",
    // 让含有style的变量可以得到tailwind提示
    ".*[Ss]tyle.*", 
  ],
```
