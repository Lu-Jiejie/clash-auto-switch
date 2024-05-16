# clash-auto-switch

[![license][license-badge]][license-href]

一个简单的 Typescript 脚本，当 [Clash](https://github.com/Z-Siqi/Clash-for-Windows_Chinese) 节点延迟高或不可用时，自动切换到预设节点中延迟最低的节点。

## 使用

在仓库目录下新建一个 `.env` 文件，内容如下：

```ini
# 通过 Clash 面板中的“主目录”，找到config.yaml文件里获取secret和external-controller
SECRET=YOUR_SECRET
EXTERNAL_CONTROLLER=YOUR_EXTERNAL_CONTROLLER

# 脚本只支持在组内切换节点
# 通过 Clash 面板中的 “Clash 核心” 后面的链接，可以查看并复制节点组的名称
# 比如，一个组的名称可能是“🔰 选择节点”
SELECTOR=YOUR_SELECTOR

# 延迟阈值，单位毫秒，高于此值的节点会被切换
DELAY_THRESHOLD=300

# 所有备选的节点应该包含的关键字，用逗号分隔
PROXIES_INCLUDE=香港
# 所有备选的节点不应该包含的关键字，用逗号分隔
PROXIES_EXCLUDE=DIRECT,免费
# 自动切换的时间间隔，cron表达式。默认为1分钟
CRON=0 * * * * *
```

确保你已经安装了所有依赖：

```bash
pnpm install
```

然后执行以下命令：

```bash
npm run start
```

<!-- Badge -->
[license-badge]: https://img.shields.io/github/license/Lu-Jiejie/clash-auto-switch?style=flat&color=ddd&labelColor=444
[license-href]: https://github.com/Lu-Jiejie/clash-auto-switch/blob/main/LICENSE
