import { courseLessons } from '../inference-course/data.js';

// Add another entry and its component to publish a new topic in this area.
export const topicModules = [
  {
    id: 'inference',
    title: '推理入门',
    description: '从 token、Attention 和生成过程开始，学习缓存、调度与推理压测。',
    lessonCount: courseLessons.length,
    prerequisites: '需要基本 Python 知识',
    format: '站内图解与练习无需 GPU',
    load: () => import('../inference-course/InferenceCourse.jsx'),
    getProps: ({ inferenceCourseState, setInferenceCourseState, openTopic }) => ({
      courseState: inferenceCourseState,
      setCourseState: setInferenceCourseState,
      openTopic,
    }),
  },
];

export const TOPIC_MODULE_BY_ID = Object.assign(Object.create(null), Object.fromEntries(topicModules.map(topic => [topic.id, topic])));
