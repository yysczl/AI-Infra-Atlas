# Infra Atlas · AI 基建学习站

一个面向零基础学习者的 AI Infra 自学网站。包含 15 个知识领域、60 节带练习与自测的站内微课、126 条主题化精选资源、10 个可照着操作的实验手册，以及可编辑的 Markdown 学习笔记。七个学习阶段各有一份四步综合项目和五题结业测验，支持项目模板下载、在线评分、错题复习与成绩保存。新手可从第 0 步先修课和零 GPU 训练实验开始。

## 专题学习

原网站侧栏的“专题学习”进入统一专题目录，目前包含“推理入门”模块，再从模块进入六节课程。它与原首页、学习路径、主题抽屉、实验和笔记共用一个网站、同一套启动与构建命令。

- `#/topics`：专题总览。
- `#/topics/inference`：推理入门课程目录与继续阅读。
- `#/topics/inference/inf-kv`：某一节课；本页目录生成带 `section` 参数的段落链接。旧的 `#/inference` 和课程地址仍然可用。
- `src/features/topics/catalog.js`：专题配置与模块加载入口；新增专题在这里登记，列表和路由自动接入，详见同目录 README。
- 推理课程正文和阅读器保存在 `src/features/inference-course/`。原有 60 节微课的内容和进度统计保留。
- 推理课程完成情况和阅读位置继续使用 `infra-atlas-inference-course-v1`，纳入原“设置与备份”的 JSON；已有记录无需迁移。
- 课程先修入口使用原主题抽屉，实验入口使用原实验页并提供返回课程的链接，全站搜索可检索推理课程正文。

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
npm run test:ui
```

构建结果位于 `dist/`。UI 验收需要本机 Chrome，会通过临时预览服务检查核心交互与手机端布局，并在结束后停止服务。这是纯静态 React 网站，没有服务端数据库或账号系统。

## 维护学习内容

### 添加学习笔记

可以直接在网站“我的笔记”页新建，内容保存在当前浏览器。如果希望把笔记作为内置内容随站点一起提供，可以生成 Markdown 文件：

```bash
npm run new:note -- "我的 AI Infra 学习笔记"
npm run dev
```

新文件会出现在 `src/content/notes/`。Markdown 顶部的 frontmatter 用于设置标题、日期、摘要、标签和类型。

### 维护课程、资源、实验与阶段考核

- `src/content/curriculum.js`：知识领域、核心主题、学习路径、技术栈层级。
- `src/content/lessons.js`：每个主题的站内微课，包含预计时长、Markdown 正文、练习、预期结果、常见误区、自测答案和有序 `resourceIds`；主题 ID 必须与课程一致。
- `src/content/resources.json`：资源库，每条资源需要唯一 `id`、标题、URL、领域、类型、难度、语言和推荐理由。
- `src/content/labs.js`：实验目标、步骤摘要、环境要求、记录指标与关联资料。
- `src/content/lab-guides.js`：每个实验的环境检查、安全提醒、完整命令、预期结果、故障排查和清理说明。
- `src/content/stage-assessments.js`：七个阶段的综合项目与结业测验。每个项目包含四步、交付物和合计 100 分的量规；每份测验包含五道四选一题，`topicId` 指向错题复习微课，`answer` 是正确选项的从 0 开始索引，80 分通过。
- `src/content/notes/`：自动加载的 Markdown 学习指南与笔记模板。

### 资源链接体检

```bash
npm run check:links
```

网络超时、限流和反爬会标记为“待确认”，只有明确的 404/410 才计为失效。检查外部链接需要联网。

## 学习数据与备份

学习进度、收藏、实验勾选、结业测验成绩、浏览器内新建笔记和主题设置使用 localStorage 保存，**不会跨浏览器或跨设备同步**。清理浏览器数据前，请在“设置与备份”页导出 JSON；换设备时可再导入。单篇笔记与阶段项目记录也可导出为 Markdown。

## 目录

```text
src/
├── App.jsx               # 页面与交互
├── styles.css            # 响应式明暗主题
└── content/              # 所有学习内容
scripts/                  # 新建笔记、内容校验、UI 验收、链接检查
public/                   # 静态资源
```
