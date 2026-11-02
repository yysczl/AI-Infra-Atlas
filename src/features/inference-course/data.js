import { topicsHref } from '../topics/routes.js';

export const courseLessons = [
  {
    "id": "model-tokens",
    "title": "token 与张量",
    "summary": "文字如何变成模型输入",
    "minutes": 20,
    "prerequisites": [
      "base-python"
    ],
    "labIds": [],
    "quiz": {
      "question": "两段文字字符数相同，输入 token 数一定相同吗？",
      "answer": "不一定。切分结果取决于 tokenizer、文本内容和特殊标记。应对实际编码后的 ID 序列计数。"
    },
    "description": "从文本切分、token ID 到嵌入向量，跟踪模型输入的形状。"
  },
  {
    "id": "model-attention",
    "title": "Attention",
    "summary": "跟着小矩阵算一遍",
    "minutes": 30,
    "prerequisites": [
      "model-tokens"
    ],
    "labIds": [],
    "quiz": {
      "question": "为什么要先对注意力分数施加因果掩码，再沿行做 softmax？",
      "answer": "被遮位置的分数不应参与有效位置的归一化。将它们设为负无穷后做 softmax，对应权重为 0，其余允许位置的权重和为 1。"
    },
    "description": "用小矩阵理解 Q、K、V、因果掩码与注意力输出。"
  },
  {
    "id": "inf-decode",
    "title": "一次生成的过程",
    "summary": "从输入到下一个 token",
    "minutes": 25,
    "prerequisites": [
      "model-attention"
    ],
    "labIds": [],
    "quiz": {
      "question": "为什么增大 batch 对 decode 的收益常比对长 prefill 更复杂？",
      "answer": "decode 更受带宽、KV Cache、调度和显存容量影响，增大 batch 虽可复用权重读取，也会挤占缓存并改变排队与尾延迟。"
    },
    "description": "跟着一条请求，分清 prefill、decode 和生成过程中的时间指标。"
  },
  {
    "id": "inf-kv",
    "title": "KV Cache 与显存",
    "summary": "解释缓存并计算占用",
    "minutes": 30,
    "prerequisites": [
      "inf-decode"
    ],
    "labIds": [
      "lab-kv"
    ],
    "quiz": {
      "question": "PagedAttention 能否让同样 token 数的 KV 数据本身变小？",
      "answer": "不能。它主要改善块分配、碎片与共享管理；每 token 的 K/V 元素和字节仍由模型与精度决定。"
    },
    "description": "看看模型缓存了什么，再从一个位置算到多条请求的显存占用。"
  },
  {
    "id": "inf-batch",
    "title": "连续批处理",
    "summary": "观察长短请求的调度",
    "minutes": 25,
    "prerequisites": [
      "inf-kv"
    ],
    "labIds": [],
    "quiz": {
      "question": "连续批处理为什么不等于“batch 越大越好”？",
      "answer": "更大运行批次会增加 KV 显存、调度和尾延迟压力，收益受显存、流量和 SLO 共同限制。"
    },
    "description": "用三条长短不同的请求，观察空出的批次位置如何被复用。"
  },
  {
    "id": "serve-bench",
    "title": "读懂推理压测",
    "summary": "从结果判断性能问题",
    "minutes": 30,
    "prerequisites": [
      "inf-batch"
    ],
    "labIds": [
      "lab-serving"
    ],
    "quiz": {
      "question": "为什么必须用真实或接近真实的输入输出长度分布？",
      "answer": "prefill、decode、KV Cache 和排队都受长度影响，固定短请求得到的容量不能直接代表长请求流量。"
    },
    "description": "用一份明确口径的结果表，算清延迟、吞吐和达标请求数。"
  }
];

export const COURSE_LESSON_BY_ID = Object.assign(Object.create(null), Object.fromEntries(courseLessons.map(lesson => [lesson.id, lesson])));
export const EMPTY_COURSE_STATE = { progress: {}, readingPosition: null };
export const COURSE_STORAGE_KEY = 'infra-atlas-inference-course-v1';
export function sectionId(text) {
  return text.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-');
}
export function courseHref(id, section) {
  return topicsHref('inference', id, section);
}
export function validateCourseState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  if (!value.progress || typeof value.progress !== 'object' || Array.isArray(value.progress)) return false;
  if (!Object.entries(value.progress).every(([id,done]) => Object.hasOwn(COURSE_LESSON_BY_ID,id) && typeof done === 'boolean')) return false;
  const position = value.readingPosition;
  return position === null || !!position && typeof position === 'object' && Object.hasOwn(COURSE_LESSON_BY_ID,position.topicId) && typeof position.section === 'string' && (position.updatedAt === undefined || typeof position.updatedAt === 'string');
}
