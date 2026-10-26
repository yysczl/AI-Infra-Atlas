# Infra Atlas · AI 基建学习站

一个内容驱动、本地优先的 AI Infra 学习网站。包含 14 个知识领域、56 个核心主题、92 条精选资源、9 个实验手册，以及可编辑的 Markdown 个人笔记。

## 本地启动

需要 Node.js 20.19+ 或 22.12+。

```bash
npm install
npm run dev
```

终端会显示本地预览地址。需要指定地址与端口时：

```bash
npm run dev -- --host 0.0.0.0 --port 7100
```

## 构建与校验

```bash
npm run check
npm run build
```

构建结果位于 `dist/`。这是纯静态 React 网站，没有服务端数据库或账号系统。

## 持续更新内容

### 写个人笔记

可以直接在网站“个人笔记”页新建，内容保存在当前浏览器。也可以生成 Markdown 源文件，让笔记随网站源码一起维护：

```bash
npm run new:note -- "我的 AI Infra 学习笔记"
npm run dev
```

新文件会出现在 `src/content/notes/`。Markdown 顶部的 frontmatter 用于设置标题、日期、摘要、标签和类型。

### 维护其他内容

- `src/content/curriculum.js`：知识领域、核心主题、学习路径、技术栈层级。
- `src/content/resources.json`：资源库，每条资源需要唯一 `id`、标题、URL、领域、类型、难度、语言和推荐理由。
- `src/content/labs.js`：实验环境、步骤、指标、交付物与关联资料。
- `src/content/notes/`：自动加载的 Markdown 笔记。

### 资源链接体检

```bash
npm run check:links
```

网络超时、限流和反爬会标记为“待确认”，只有明确的 404/410 才计为失效。检查外部链接需要联网。

## 学习数据与备份

学习进度、收藏、实验勾选、浏览器内新建笔记和主题设置使用 localStorage 保存，**不会跨浏览器或跨设备同步**。清理浏览器数据前，请在“更新与备份”页导出 JSON；换设备时可再导入。单篇笔记也可导出为 Markdown。

## 目录

```text
src/
├── App.jsx               # 页面与交互
├── styles.css            # 响应式明暗主题
└── content/              # 所有学习内容
scripts/                  # 新建笔记、校验、链接检查
public/                   # 静态资源
```
