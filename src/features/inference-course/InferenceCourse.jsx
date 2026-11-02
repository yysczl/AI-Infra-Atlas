import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, FlaskConical, RotateCcw } from 'lucide-react';
import { courseLessons, COURSE_LESSON_BY_ID, courseHref, sectionId } from './data.js';
import { labs } from '../../content/labs.js';
import LessonDemo from './LessonDemo.jsx';
import { CodeBlock } from './CodeBlock.jsx';
import './styles.css';

const documents = import.meta.glob('./content/*.md', { query: '?raw', import: 'default' });
const textOf = node => node?.value || node?.children?.map(textOf).join('') || '';
const markdownComponents = {
  h2: ({ node, children }) => <h2 id={sectionId(textOf(node))}>{children}</h2>,
  h3: ({ node, children }) => <h3 id={sectionId(textOf(node))}>{children}</h3>,
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    if (className === 'language-atlas-demo') return <LessonDemo name={String(children).trim()} />;
    if (className === 'language-atlas-answer') return <details className="exercise-answer"><summary>查看解答</summary><ReactMarkdown remarkPlugins={[remarkGfm]}>{String(children)}</ReactMarkdown></details>;
    return className ? <CodeBlock title="示例代码" language={className.replace('language-', '')} code={String(children).replace(/\n$/, '')} /> : <code>{children}</code>;
  },
  a: ({ href, children }) => <a href={href} {...(/^https?:/.test(href || '') ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}</a>,
  table: ({ children }) => <div className="reader-table"><table>{children}</table></div>,
};
const LessonMarkdown = React.memo(function LessonMarkdown({ body }) {
  return <div className="markdown-body lesson-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{body}</ReactMarkdown></div>;
});

export default function InferenceCourse({ route, courseState, setCourseState, openTopic }) {
  if (!route?.id) return <div className="inference-area"><CourseOverview {...{ courseState, openTopic }} /></div>;
  const lesson = COURSE_LESSON_BY_ID[route.id];
  return <div className="inference-area">{lesson ? <LessonReader key={lesson.id} {...{ lesson, route, courseState, setCourseState, openTopic }} /> : <section className="reader-load-state"><h1>没有找到这节课</h1><a className="btn btn-primary" href={courseHref()}>返回推理入门</a></section>}</div>;
}

function CourseOverview({ courseState, openTopic }) {
  const { progress, readingPosition } = courseState;
  const done = courseLessons.filter(lesson => progress[lesson.id]).length;
  const resume = COURSE_LESSON_BY_ID[readingPosition?.topicId];
  const next = courseLessons.find(lesson => !progress[lesson.id]);
  useEffect(() => { window.scrollTo({top:0,behavior:'instant'}); }, []);
  return <div className="inference-overview">
    <header className="course-intro"><div className="eyebrow">专题课程 · 已完成 {done} / 6 节</div><h1>推理入门</h1><p>从文字如何进入模型，学到如何分析推理服务的性能。</p><p className="course-prerequisites">需要基本 Python 知识。图解与练习不需要 GPU；运行实验前再检查硬件要求。<button onClick={() => openTopic('foundations', 'base-python')}>查看 Python 先修课</button></p></header>
    <section className="resume-reading" aria-label="继续学习"><div><span className="eyebrow">{resume ? '继续阅读' : next ? '从这里开始' : '课程回顾'}</span><h2>{resume?.title || next?.title || '六节课已完成'}</h2><p>{resume ? '返回上次阅读的位置。' : next ? '按顺序阅读，也可以从下面选择一节。' : '选择一节课重新阅读或练习。'}</p></div><a className="btn btn-primary" href={courseHref(resume?.id || next?.id || courseLessons[0].id, resume ? readingPosition.section : undefined)}>{resume ? '继续阅读' : next ? '开始学习' : '复习课程'}<ArrowRight size={16} /></a></section>
    <ol className="course-list">{courseLessons.map((lesson,index) => <li key={lesson.id}><span className="course-number">{String(index+1).padStart(2,'0')}</span><a href={courseHref(lesson.id)}><strong>{lesson.title}</strong><span>{lesson.summary}</span></a><span className="course-status">{progress[lesson.id] ? <><Check size={15} />已完成</> : <ArrowRight size={17} />}</span></li>)}</ol>
    <p className="course-note">本专题单独记录完成情况，原学习路径和阶段测验照常使用。</p><a className="reader-back" href="#/curriculum"><ArrowLeft size={15} />查看原学习路径</a>
  </div>;
}

function LessonReader({ lesson, route, courseState, setCourseState, openTopic }) {
  const [body, setBody] = useState('');
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const articleRef = useRef(null);
  const positionRef = useRef('');
  const index = courseLessons.findIndex(item => item.id === lesson.id);
  const headings = useMemo(() => [...body.matchAll(/^#{2,3} (.+)$/gm)].map(match => ({title:match[1].replace(/[`*]/g,''),id:sectionId(match[1].replace(/[`*]/g,''))})), [body]);
  useEffect(() => {
    let cancelled = false;
    setError(false);
    documents[`./content/${lesson.id}.md`]().then(text => {if (!cancelled) setBody(text);}).catch(() => {if (!cancelled) setError(true);});
    return () => {cancelled = true;};
  }, [lesson.id, retry]);
  useEffect(() => {
    if (!body) return;
    const frame = requestAnimationFrame(() => {
      const target = route.section && document.getElementById(route.section);
      if (target) { target.scrollIntoView({behavior:'instant'}); target.tabIndex = -1; target.focus({preventScroll:true}); }
      else window.scrollTo({top:0,behavior:'instant'});
      const section = target ? route.section : '';
      positionRef.current = section;
      setActiveSection(section);
      setCourseState(state => ({...state, readingPosition:{topicId:lesson.id,section,updatedAt:new Date().toISOString()}}));
    });
    return () => cancelAnimationFrame(frame);
  }, [body,route.section,lesson.id,setCourseState]);
  useEffect(() => {
    if (!body) return;
    let timer;
    const save = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!articleRef.current) return;
        const nodes = [...articleRef.current.querySelectorAll('h2[id], h3[id]')];
        const current = nodes.filter(node => node.getBoundingClientRect().top < 150).at(-1)?.id || '';
        if (current === positionRef.current) return;
        positionRef.current = current;
        setActiveSection(current);
        setCourseState(state => ({...state,readingPosition:{topicId:lesson.id,section:current,updatedAt:new Date().toISOString()}}));
      },150);
    };
    window.addEventListener('scroll',save,{passive:true});
    return () => {window.removeEventListener('scroll',save);clearTimeout(timer);};
  }, [body,lesson.id,setCourseState]);
  const chapters = <ol>{courseLessons.map((item,i) => <li key={item.id}><a href={courseHref(item.id)} aria-current={item.id === lesson.id ? 'page' : undefined}><span>{String(i+1).padStart(2,'0')}</span>{item.title}{courseState.progress[item.id] && <CheckCircle2 size={14} aria-label="已完成" />}</a></li>)}</ol>;
  const toc = <ol>{[...headings,{id:'self-check',title:'检查理解'},...(lesson.labIds.length ? [{id:'related-labs',title:'动手实验'}] : [])].map(item => <li key={item.id}><a href={courseHref(lesson.id,item.id)} aria-current={activeSection === item.id ? 'location' : undefined} onClick={event => event.currentTarget.closest('details')?.removeAttribute('open')}>{item.title}</a></li>)}</ol>;
  return <>
    <div className="reader-mobile-nav"><details><summary>课程目录 · 第 {index+1} 节</summary>{chapters}</details><details><summary>本页目录</summary>{toc}</details></div>
    <div className="reader-layout"><aside className="reader-chapters"><a className="reader-back" href={courseHref()}><ArrowLeft size={14} />专题目录</a><h2>推理入门</h2>{chapters}</aside>
      <article className="lesson-article" ref={articleRef}><header className="lesson-header"><div className="eyebrow">第 {index+1} 节 · 阅读与练习约 {lesson.minutes} 分钟</div><h1>{lesson.title}</h1><p>{lesson.description}</p><div className="lesson-prerequisites">先修：{lesson.prerequisites.map(id => COURSE_LESSON_BY_ID[id] ? <a key={id} href={courseHref(id)}>{COURSE_LESSON_BY_ID[id].title}</a> : <button key={id} onClick={() => openTopic('foundations',id)}>Python 环境与张量基础</button>)}</div></header>
      {error ? <div role="alert" className="reader-load-state">课程加载失败，请重试。<button className="btn btn-ghost" onClick={() => setRetry(value => value+1)}>重新加载</button></div> : !body ? <p role="status">正在加载课程…</p> : <>
        <LessonMarkdown body={body} />
        <section className="lesson-self-check"><h2 id="self-check">检查理解</h2><p>{lesson.quiz.question}</p><details><summary>查看参考答案</summary><p>{lesson.quiz.answer}</p></details></section>
        {lesson.labIds.length > 0 && <section className="lesson-labs"><h2 id="related-labs">动手实验</h2>{lesson.labIds.map(id => {const lab = labs.find(item => item.id === id);return <a key={id} href={`#/labs?lab=${id}&courseLesson=${lesson.id}`}><FlaskConical size={20}/><span><strong>{lab.title}</strong><small>{lab.environment} · {lab.duration}</small></span><ArrowRight size={16}/></a>;})}</section>}
        <footer className="reader-completion"><button className={`btn ${courseState.progress[lesson.id] ? 'btn-ghost' : 'btn-primary'}`} onClick={() => setCourseState(state => ({...state,progress:{...state.progress,[lesson.id]:!state.progress[lesson.id]}}))}>{courseState.progress[lesson.id] ? <RotateCcw size={16}/> : <CheckCircle2 size={16}/>} {courseState.progress[lesson.id] ? '取消完成标记' : '标记为已完成'}</button><p>阅读位置自动保存，完成标记由你决定。</p><nav aria-label="相邻课程">{index > 0 ? <a href={courseHref(courseLessons[index-1].id)}><ArrowLeft size={16}/><span>上一节<small>{courseLessons[index-1].title}</small></span></a> : <span/>}{index < courseLessons.length-1 ? <a href={courseHref(courseLessons[index+1].id)}><span>下一节<small>{courseLessons[index+1].title}</small></span><ArrowRight size={16}/></a> : <a href={courseHref()}>返回推理入门<ArrowRight size={16}/></a>}</nav></footer>
      </>}
      </article><aside className="reader-toc"><h2>本页目录</h2>{toc}</aside>
    </div>
  </>;
}
