import { lazy, Suspense, useEffect } from 'react';
import { ArrowRight, BookOpen, ChevronRight } from 'lucide-react';
import { topicModules, TOPIC_MODULE_BY_ID } from './catalog.js';
import { topicsHref } from './routes.js';
import './styles.css';

const topicComponents = Object.fromEntries(topicModules.map(topic => [topic.id, lazy(topic.load)]));

export default function TopicArea({ route, ...context }) {
  if (!route?.topicId) return <TopicCatalog />;
  const topic = TOPIC_MODULE_BY_ID[route.topicId];
  if (!topic) return <section className="topic-area-empty"><h1>没有找到这个专题</h1><a className="btn btn-primary" href={topicsHref()}>返回专题学习</a></section>;
  const Component = topicComponents[topic.id];
  return <div className="topic-module-area">
    <nav className="topic-area-breadcrumb" aria-label="专题导航"><a href={topicsHref()}>专题学习</a><ChevronRight size={14} /><a href={topicsHref(topic.id)} aria-current={route.lessonId ? undefined : 'page'}>{topic.title}</a></nav>
    <Suspense fallback={<p role="status">正在加载专题…</p>}><Component route={{ id: route.lessonId, section: route.section }} {...topic.getProps(context)} /></Suspense>
  </div>;
}

function TopicCatalog() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  return <section className="topics-catalog">
    <header className="page-title-row"><div><div className="eyebrow">按专题学习</div><h1>专题学习</h1><p>选择一个专题，按顺序阅读、做练习或进入实验。</p></div></header>
    <div className="topic-module-grid">{topicModules.map(topic => <a className="topic-module-card" key={topic.id} href={topicsHref(topic.id)}>
      <div className="topic-module-heading"><span className="topic-module-icon"><BookOpen size={22} /></span><span className="topic-module-count">{topic.lessonCount} 节课程</span></div>
      <h2>{topic.title}</h2><p>{topic.description}</p>
      <ul className="topic-module-details"><li>{topic.prerequisites}</li><li>{topic.format}</li></ul>
      <span className="topic-module-open">查看课程<ArrowRight size={17} /></span>
    </a>)}</div>
  </section>;
}
