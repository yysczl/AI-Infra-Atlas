# 推理入门模块

这是“专题学习”中的一个模块。入口为原侧栏“专题学习” → “推理入门”，地址 `#/topics/inference`。运行根目录的 `npm run dev`；不需要独立启动或安装依赖。统一专题目录和模块注册见 `../topics/README.md`。

- `InferenceCourse.jsx`：专题目录、继续阅读与连续正文阅读页。
- `data.js`：六节课程的元数据、顺序、站内地址及专题状态校验。
- `content/`：六篇 Markdown 正文。
- `LessonDemo.jsx`：token、Attention、生成、KV、批处理与压测的教学演示。
- `CodeBlock.jsx`：带复制按钮的课程代码块。
- `search.js`：按需加载的六节正文搜索，接入原站搜索面板。
- `styles.css`：仅作用于 `.inference-area` 内的样式。

原 `src/content/curriculum.js`、`lessons.js` 及其他内容源未被迁移或替换。原首页、新手页、学习路径和主题抽屉继续使用原数据与样式。App 接入统一“专题学习”入口，推理模块通过专题配置按需加载，并使用原搜索、实验和备份。

专题进度不自动等同于原主题完成情况；阅读位置与完成标记也分别保存。备份版本保持为 1，`data.inferenceCourse` 是可选字段，内容为 `{ progress, readingPosition }`。

正文支持标准 Markdown、GFM 表格；`atlas-demo` 围栏插入已登记的教学演示，`atlas-answer` 围栏显示折叠解答。技术说明、例题及出处沿用已编写的六节内容，教学数据不代表真实 GPU 性能。

校验与浏览器回归由根目录 `npm run check`、`npm run build`、`npm run test:ui` 执行，覆盖原功能、专题总览和推理课程。

旧的 `#/inference`、`#/inference/<lesson-id>` 地址由统一专题路由兼容。新链接使用 `#/topics/inference/<lesson-id>`，学习记录与备份字段保持不变。
