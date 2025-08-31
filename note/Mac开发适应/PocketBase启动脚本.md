# PocketBase 启动脚本（macOS）

提供了一个 **macOS 专用启动脚本**，用于运行 PocketBase。

---

## 说明

- `start_mac.sh`  
  用于 macOS 系统的启动脚本，功能与 Windows 下的 `start.bat` 等价  

1. 自动进入脚本所在目录  
2. 执行数据库迁移命令：`pocketbase migrate up`  
3. 启动 PocketBase 服务：`pocketbase serve`

### 请确保已安装 PocketBase

## 赋予脚本执行权限

在终端进入脚本目录，运行：

```sh
chmod +x start_mac.sh

3. 运行脚本

./start_mac.sh

4. 允许应用运行（仅首次）

macOS 可能会拦截从互联网下载的二进制文件。
如果运行时提示 无法打开，因为它来自身份不明的开发者，请前往：

系统设置 → 隐私与安全性 → 允许“pocketbase”运行

点击“允许”后重新运行脚本即可