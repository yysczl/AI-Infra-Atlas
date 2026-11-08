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

## 科普视频与配套资料

侧栏“科普视频”按视频选题展示资料。视频在外部平台播放，本站提供互动 HTML 课件、Markdown 在线阅读和原文件下载。没有填写视频链接时，页面隐藏观看按钮。

- `#/videos`：科普视频列表。
- `#/videos/ai-infra-overview-video`：第一期资料页，可放进视频简介，作为固定资料入口。
- `#/videos/ai-infra-overview-video/resources/overview`：第一期补充文章。目录链接使用 `?section=段落标识`，刷新和分享后仍能定位。
- `src/content/videos.js`：每期内容的清单，数组顺序就是栏目展示顺序。
- `src/features/videos/`：栏目页面、路由、文档阅读器和样式。新增课程通常无需修改这些文件或 `App.jsx`。

### 新增一期课程

**1. 放入公开文件。** 在 `public/courses/` 下新建一个目录，建议使用稳定的英文短名称，例如 `gpu-memory`：

```text
public/courses/gpu-memory/
├── slides/
│   ├── index.html          # HTML 课件入口
│   └── assets/             # 课件依赖的 JS、CSS、图片等
├── resource/
│   ├── overview.md         # 补充文章
│   ├── glossary.md         # 可选：第二篇资料
│   └── images/
│       └── memory.svg      # 可选：文章配图
└── cover.webp              # 可选：列表封面，建议 16:9
```

HTML 课件按原目录保留依赖，使用相对路径引用，例如 `assets/style.css`。课件会在新标签页独立打开。第一期使用 `index.html?mode=instructor` 显示翻页与播放控制，避免进入默认隐藏控件的录制模式；`slides` 路径可以附带课件支持的查询参数。不同课程可以使用不同的课件目录名，清单里的路径与实际文件一致即可。

Markdown 使用 UTF-8 编码，无需 frontmatter。建议使用一个 `#` 主标题，以 `##`、`###` 组织正文，阅读器将它们显示在目录中。正文支持表格、列表、代码块、图片和 LaTeX 公式（KaTeX）；同名标题会自动加序号区分。

公式使用 `$…$` 表示行内公式，例如 `$d_k$`；独立公式用单独一行的 `$$` 包围，前后留空行：

```markdown
$$
\operatorname{Attention}(Q,K,V)
=\operatorname{softmax}\left(\frac{QK^\mathsf{T}}{\sqrt{d_k}}+M\right)V
$$
```

请将 `\(...\)` 和 `\[...\]` 写法分别改为上述行内与独立公式格式。长公式在手机上可横向滚动，代码块中的公式保持原样显示。

文章内的图片与附件使用相对于 Markdown 文件的路径，例如 `![显存示意图](images/memory.svg)`；同篇文章的标题链接可写成 `#标题标识`。跨文章跳转请使用已登记的站内阅读地址，例如 `/#/videos/gpu-memory/resources/glossary`。相对 `.md` 链接会直接打开原文件，不会自动转成阅读页面。

`public/` 下的文件都会公开并复制到构建目录。制作脚本、缓存、录制源文件和内部草稿应保存在 `public/` 之外。仅放入文件不会自动生成列表，公开展示的课程和文章还需要在清单中登记。

**2. 修改 `src/content/videos.js`。** 在 `videos` 数组里新增一项，例如：

```js
{
  id: 'gpu-memory',
  title: 'GPU 显存都用在哪里？',
  description: '拆开模型权重、运行中的计算和 KV Cache，理解显存的去向。',
  audience: '适合已经了解 Token 和模型推理基本流程的读者。',
  slides: '/courses/gpu-memory/slides/index.html',
  cover: '/courses/gpu-memory/cover.webp',
  videoLinks: [],
  resources: [
    {
      id: 'overview',
      title: 'GPU 显存使用说明',
      description: '配合课件阅读的概念解释与计算示例。',
      path: '/courses/gpu-memory/resource/overview.md',
    },
    {
      id: 'glossary',
      title: '术语速查',
      path: '/courses/gpu-memory/resource/glossary.md',
    },
  ],
},
```

以上示例路径需有对应文件；如果没有封面或第二篇文章，删除对应字段或资料项。

| 字段 | 要求 |
| --- | --- |
| `id` | 必填，课程间唯一，以小写字母开头，只包含小写字母、数字和连字符；与课程目录名一致 |
| `title`、`description` | 必填，分别作为展示标题和简介 |
| `audience` | 可选，适合谁阅读 |
| `slides` | 可选，HTML 课件路径 |
| `cover` | 可选，封面路径；省略时使用文字图形卡片 |
| `videoLinks` | 必填数组，可暂时填 `[]`；每项包含平台名称 `label` 和完整的 HTTP(S) 地址 `url` |
| `resources` | 必填数组，可为 `[]`；每篇文章包含本期唯一的 `id`、展示标题 `title` 和 `.md` 文件路径 `path`，`description` 可选 |

课件和补充文章至少提供一项。本地文件路径以 `/courses/<课程 id>/` 开头，**不包含 `public`**。课程及文章的 `id` 发布后尽量保持不变，以免旧的视频简介链接失效。文件名可以用中文，页面标题由清单配置决定。

视频发布后，只需将对应的 `videoLinks` 改为真实链接：

```js
videoLinks: [
  { label: 'B 站', url: 'https://www.bilibili.com/video/实际视频编号/' },
],
```

此处地址为格式示例，登记时请替换为已经发布的视频地址。多个平台可以继续追加，页面将分别显示观看按钮。

**3. 检查并发布。**

```bash
npm run check
npm run build
npm run test:ui
```

内容校验会检查 ID、必填字段、视频链接格式，以及清单中的 HTML、Markdown 和封面是否存在。课件内部依赖、Markdown 内部图片及附件仍需在本地打开确认。UI 验收检查第一期的栏目入口、阅读、目录、下载和手机端布局。

启动本地网站后，访问 `/#/videos/gpu-memory`，依次打开课件、文档、图片与视频链接。确认后沿用项目原有部署方式发布 `dist/`。以后更新文章或课件，直接修改对应文件并重新构建部署；修改标题、简介、平台链接或增删资料，则编辑 `videos.js`。
