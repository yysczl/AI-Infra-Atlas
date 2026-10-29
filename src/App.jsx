import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, ArrowUpRight, BarChart3, Bookmark, BookmarkCheck,
  BookOpen, Boxes, Braces, Cable, Check, CheckCircle2, ChevronDown, ChevronLeft,
  ChevronRight, Circle, CircleHelp, Clock3, Command, Copy, Cpu, Database,
  Download, Edit3, FileText, FlaskConical, GitBranch, HardDrive,
  Layers3, LayoutDashboard, LibraryBig, ListChecks, Map, Menu, Moon, Network, NotebookPen,
  Plus, RotateCcw, Save, ScanSearch, Search, Server, Settings2, ShieldCheck,
  SquareTerminal, Sun, Trash2, Upload, Workflow, X, Zap,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { learningPaths, modules, stackLayers } from './content/curriculum.js';
import resources from './content/resources.json';
import { lessons } from './content/lessons.js';
import { labs } from './content/labs.js';
import { labGuides } from './content/lab-guides.js';
import { builtInNotes } from './content/notes.js';
import { stageAssessments, QUIZ_PASS_SCORE } from './content/stage-assessments.js';

const PAGE_IDS = ['dashboard', 'start', 'curriculum', 'map', 'resources', 'labs', 'notes', 'maintenance'];
const PAGE_META = {
  dashboard: { label: '首页', eyebrow: '学习首页' },
  start: { label: '新手起步', eyebrow: '第 0 步' },
  curriculum: { label: '学习路径', eyebrow: '课程' },
  map: { label: '知识地图', eyebrow: '知识地图' },
  resources: { label: '资源库', eyebrow: '资源库' },
  labs: { label: '动手实验', eyebrow: '实验教程' },
  notes: { label: '我的笔记', eyebrow: '笔记' },
  maintenance: { label: '设置与备份', eyebrow: '设置' },
};
const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard },
  { id: 'start', icon: Zap },
  { id: 'curriculum', icon: BookOpen },
  { id: 'map', icon: Map },
  { id: 'resources', icon: LibraryBig },
  { id: 'labs', icon: FlaskConical },
  { id: 'notes', icon: NotebookPen },
  { id: 'maintenance', icon: Settings2 },
];
const MODULE_ICONS = {
  foundations: BookOpen, systems: SquareTerminal, hardware: Cpu, kernels: Braces, frameworks: Workflow,
  distributed: Network, network: Cable, data: Database, inference: Zap,
  serving: Server, platform: Boxes, observability: Activity, rag: ScanSearch,
  mlops: GitBranch, governance: ShieldCheck,
};
const RESOURCE_TYPES = ['全部类型', ...new Set(resources.map((item) => item.type))];
const RESOURCE_LANGUAGES = ['全部语言', ...['中文', '中文字幕', 'English'].filter((lang) => resources.some((item) => item.lang === lang))];
const ALL_TOPICS = modules.flatMap((module) => module.topics.map((topic) => ({ ...topic, module })));
const ORDERED_TOPICS = learningPaths.flatMap((path) => path.moduleIds.flatMap((id) =>
  ALL_TOPICS.filter((topic) => topic.module.id === id)));
const STORAGE = {
  progress: 'infra-atlas-progress-v1', bookmarks: 'infra-atlas-bookmarks-v1',
  notes: 'infra-atlas-notes-v1', labs: 'infra-atlas-labs-v1', theme: 'infra-atlas-theme-v1',
  assessments: 'infra-atlas-assessments-v1',
};

function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored === null ? fallback : JSON.parse(stored);
    } catch { return fallback; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage can be unavailable in private mode. */ }
  }, [key, value]);
  return [value, setValue];
}

function downloadFile(name, content, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function noteToMarkdown(note) {
  return `---\ntitle: "${note.title.replaceAll('"', '\\"')}"\ndate: "${note.date}"\ntags: ${JSON.stringify(note.tags || [])}\n---\n\n${note.body}\n`;
}

function ProgressRing({ value, size = 72, stroke = 6, label }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="progress-ring" style={{ width: size, height: size }} aria-label={`完成 ${value}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} />
        <circle className="ring-value" cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)} />
      </svg>
      <strong>{label || `${value}%`}</strong>
    </div>
  );
}

function PageTitle({ eyebrow, title, description, actions }) {
  return (
    <div className="page-title-row">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

function SectionHead({ eyebrow, title, action }) {
  return (
    <div className="section-head">
      <div>{eyebrow && <span>{eyebrow}</span>}<h2>{title}</h2></div>
      {action}
    </div>
  );
}

function ModuleIcon({ module, size = 20 }) {
  const Icon = MODULE_ICONS[module.id] || Layers3;
  return <Icon size={size} strokeWidth={1.8} />;
}

function EmptyState({ icon: Icon = Search, title, description, action }) {
  return (
    <div className="empty-state">
      <Icon size={28} />
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

function App() {
  const initialPage = window.location.hash.replace('#/', '').replace('#', '');
  const [activePage, setActivePage] = useState(PAGE_IDS.includes(initialPage) ? initialPage : 'dashboard');
  const [mobileNav, setMobileNav] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [topicDetail, setTopicDetail] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState('foundations');
  const [selectedLabId, setSelectedLabId] = useState(labs[0].id);
  const [selectedNoteId, setSelectedNoteId] = useState(builtInNotes[0]?.id);
  const [resourceFocus, setResourceFocus] = useState({ query: '', category: 'all' });
  const [progress, setProgress] = usePersistentState(STORAGE.progress, {});
  const [bookmarks, setBookmarks] = usePersistentState(STORAGE.bookmarks, []);
  const [personalNotes, setPersonalNotes] = usePersistentState(STORAGE.notes, []);
  const [labProgress, setLabProgress] = usePersistentState(STORAGE.labs, {});
  const [assessmentRecords, setAssessmentRecords] = usePersistentState(STORAGE.assessments, {});
  const [theme, setTheme] = usePersistentState(STORAGE.theme, 'light');
  const [toast, setToast] = useState('');

  const completedTopics = ALL_TOPICS.filter((topic) => progress[topic.id]).length;
  const overallProgress = Math.round((completedTopics / ALL_TOPICS.length) * 100);
  const allNotes = useMemo(() => [...personalNotes, ...builtInNotes], [personalNotes]);
  const nextTopic = ORDERED_TOPICS.find((topic) => !progress[topic.id]);

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => {
    const onHash = () => {
      const page = window.location.hash.replace('#/', '').replace('#', '');
      if (PAGE_IDS.includes(page)) setActivePage(page);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setSearchOpen((open) => !open);
      }
      if (event.key === 'Escape') { setSearchOpen(false); setTopicDetail(null); setMobileNav(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  function navigate(page) {
    if (!PAGE_IDS.includes(page)) return;
    setActivePage(page);
    window.location.hash = `/${page}`;
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function openModule(id) { setSelectedModuleId(id); navigate('curriculum'); }
  function openTopic(moduleId, topicId) {
    const module = modules.find((item) => item.id === moduleId);
    const topic = module?.topics.find((item) => item.id === topicId);
    if (!module || !topic) return;
    setSelectedModuleId(moduleId);
    navigate('curriculum');
    setTopicDetail({ module, topic });
  }
  function openResources(category = 'all', query = '') {
    setResourceFocus({ category, query, nonce: Date.now() }); navigate('resources');
  }
  function toggleBookmark(id) {
    setBookmarks((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  }
  function openLab(id) { setSelectedLabId(id); navigate('labs'); }
  function openNote(id) { setSelectedNoteId(id); navigate('notes'); }

  const shared = { navigate, progress, setProgress, showToast: setToast };
  let content;
  if (activePage === 'dashboard') content = <Dashboard {...shared} completedTopics={completedTopics} overallProgress={overallProgress}
    openModule={openModule} openTopic={openTopic} openResources={openResources} openLab={openLab} openNote={openNote} bookmarks={bookmarks} />;
  else if (activePage === 'start') content = <StartPage navigate={navigate} openModule={openModule}
    openTopic={openTopic} openLab={openLab} openResources={openResources} />;
  else if (activePage === 'curriculum') content = <CurriculumPage {...shared} selectedModuleId={selectedModuleId}
    setSelectedModuleId={setSelectedModuleId} setTopicDetail={setTopicDetail} openResources={openResources}
    assessmentRecords={assessmentRecords} setAssessmentRecords={setAssessmentRecords} />;
  else if (activePage === 'map') content = <MapPage openModule={openModule} openResources={openResources} />;
  else if (activePage === 'resources') content = <ResourcesPage focus={resourceFocus} bookmarks={bookmarks}
    toggleBookmark={toggleBookmark} />;
  else if (activePage === 'labs') content = <LabsPage selectedLabId={selectedLabId} setSelectedLabId={setSelectedLabId}
    labProgress={labProgress} setLabProgress={setLabProgress} openModule={openModule} showToast={setToast} />;
  else if (activePage === 'notes') content = <NotesPage notes={allNotes} selectedNoteId={selectedNoteId}
    setSelectedNoteId={setSelectedNoteId} personalNotes={personalNotes} setPersonalNotes={setPersonalNotes} showToast={setToast} />;
  else content = <MaintenancePage progress={progress} setProgress={setProgress} bookmarks={bookmarks}
    setBookmarks={setBookmarks} personalNotes={personalNotes} setPersonalNotes={setPersonalNotes}
    labProgress={labProgress} setLabProgress={setLabProgress} assessmentRecords={assessmentRecords}
    setAssessmentRecords={setAssessmentRecords} theme={theme} setTheme={setTheme}
    showToast={setToast} completedTopics={completedTopics} />;

  return (
    <div className="app-shell">
      {mobileNav && <button className="nav-scrim" aria-label="关闭导航" onClick={() => setMobileNav(false)} />}
      <aside className={`sidebar ${mobileNav ? 'is-open' : ''}`}>
        <button className="brand" onClick={() => navigate('dashboard')} aria-label="返回学习首页">
          <span className="brand-mark"><span>IA</span><i /></span>
          <span><strong>Infra Atlas</strong><small>AI 基础设施学习指南</small></span>
        </button>
        <div className="sidebar-label">学习目录</div>
        <nav className="main-nav" aria-label="主导航">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} className={activePage === item.id ? 'active' : ''} onClick={() => navigate(item.id)}>
              <Icon size={19} /><span>{PAGE_META[item.id].label}</span>
              {item.id === 'resources' && <em>{resources.length}</em>}
              {item.id === 'notes' && personalNotes.length > 0 && <em>{personalNotes.length}</em>}
            </button>;
          })}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-progress">
          <div className="sidebar-progress-head"><span>我的学习进度</span><strong>{overallProgress}%</strong></div>
          <div className="linear-track"><i style={{ width: `${overallProgress}%` }} /></div>
          <p>已完成 {completedTopics} / {ALL_TOPICS.length} 个主题</p>
          <button onClick={() => nextTopic ? openTopic(nextTopic.module.id, nextTopic.id) : navigate('curriculum')}>{nextTopic ? '继续学习' : '查看课程'} <ArrowRight size={14} /></button>
        </div>
        <div className="sidebar-foot"><span className="status-dot" />学习记录仅保存在当前浏览器</div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn mobile-menu" onClick={() => setMobileNav(true)} aria-label="打开导航"><Menu size={21} /></button>
            <span className="breadcrumb">Infra Atlas <ChevronRight size={13} /> {PAGE_META[activePage].label}</span>
          </div>
          <div className="topbar-actions">
            <button className="search-trigger" onClick={() => setSearchOpen(true)}><Search size={17} /><span>搜索课程、资料和实验</span><kbd><Command size={11} /> K</kbd></button>
            <button className="icon-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="切换明暗主题">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button className="avatar" onClick={() => navigate('notes')} title="进入我的笔记" aria-label="进入我的笔记"><NotebookPen size={17} /></button>
          </div>
        </header>
        <main className={`page page-${activePage}`}>{content}</main>
        <footer className="site-footer">
          <span>Infra Atlas · AI 基础设施学习指南</span>
          <span>学习记录保存在当前浏览器，可在设置中导出</span>
        </footer>
      </div>

      {searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} notes={allNotes}
        openTopic={(module, topic) => { setSearchOpen(false); openTopic(module.id, topic.id); }}
        openResources={(query) => { setSearchOpen(false); openResources('all', query); }}
        openLab={(id) => { setSearchOpen(false); openLab(id); }}
        openNote={(id) => { setSearchOpen(false); openNote(id); }} />}
      {topicDetail && <TopicDrawer {...topicDetail} progress={progress} setProgress={setProgress}
        onClose={() => setTopicDetail(null)} openResources={openResources} />}
      {toast && <div className="toast" role="status"><CheckCircle2 size={17} />{toast}</div>}
    </div>
  );
}

function Dashboard({ navigate, openModule, openTopic, openResources, openLab, openNote, progress, overallProgress, completedTopics }) {
  const nextTopics = ORDERED_TOPICS.filter((topic) => !progress[topic.id]).slice(0, 3);
  const featured = ['fw-d2l', 'sys-openmlsys', 'inf-vllm-video', 'serve-genai-platform-blog']
    .map((id) => resources.find((item) => item.id === id)).filter(Boolean);
  const firstLab = labs[0];
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span><BookOpen size={15} /> AI Infra 学习指南</span></div>
          <h1>学习模型背后的系统：<br /><span>训练、推理与部署。</span></h1>
          <p>这里整理了 Linux、GPU、分布式训练和模型服务等课程与实验。刚接触这个领域，可以从 Linux 和 Python 开始；已有基础，可以直接选主题。</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => openTopic('foundations', 'base-linux')}>开始第一课 <ArrowRight size={17} /></button>
            <button className="btn btn-ghost" onClick={() => navigate('start')}>查看入门指南 <Map size={17} /></button>
          </div>
          <div className="hero-footnote"><ListChecks size={16} /><span>第一个训练实验可在普通电脑的 CPU 上运行</span></div>
        </div>
        <div className="hero-system learning-route" aria-label="推荐学习顺序">
          <div className="system-top"><span>推荐学习顺序</span><Map size={18} /></div>
          <div className="route-list">
            {learningPaths.slice(0, 4).map((path) => <button className="route-step" key={path.id} onClick={() => openModule(path.moduleIds[0])}>
              <span>{path.phase}</span><div><strong>{path.title}</strong><small>{path.goal}</small></div><ChevronRight size={17} />
            </button>)}
          </div>
          <button className="route-more" onClick={() => navigate('curriculum')}>查看全部七个阶段 <ArrowRight size={15} /></button>
        </div>
      </section>

      <section className="stats-strip" aria-label="网站内容统计">
        <div><strong>{modules.length}</strong><span>知识领域<small>包含新手先修模块</small></span></div>
        <div><strong>{ALL_TOPICS.length}</strong><span>站内微课<small>讲解、练习与自测</small></span></div>
        <div><strong>{resources.length}</strong><span>参考资料<small>视频、博客、文档与论文</small></span></div>
        <div><strong>{labs.length}</strong><span>动手实验<small>含 CPU 入门实验</small></span></div>
        <div className="stats-progress"><ProgressRing value={overallProgress} size={58} stroke={5} /><span>我的学习进度<small>已完成 {completedTopics} 个主题</small></span></div>
      </section>

      <div className="dashboard-grid">
        <section className="panel continue-panel">
          <SectionHead eyebrow="继续学习" title="接下来学什么" action={<button className="text-link" onClick={() => navigate('curriculum')}>完整学习路径 <ArrowUpRight size={15} /></button>} />
          <div className="next-list">
            {nextTopics.length ? nextTopics.map((topic, index) => <button key={topic.id} onClick={() => openTopic(topic.module.id, topic.id)}>
              <span className="next-index">0{index + 1}</span>
              <span><small>{topic.module.title}</small><strong>{topic.title}</strong><em>{topic.summary}</em></span>
              <ArrowUpRight size={18} />
            </button>) : <EmptyState icon={CheckCircle2} title="全部主题已完成" description="可以通过实验和笔记复习，或继续阅读进阶资料。" />}
          </div>
        </section>
        <section className="panel lab-callout">
          <div className="lab-callout-top"><span>推荐从这个实验开始</span><FlaskConical size={22} /></div>
          <div className="lab-number">{firstLab.number}</div>
          <h3>{firstLab.title}</h3><p>{firstLab.subtitle}</p>
          <div className="lab-meta"><span><Clock3 size={14} />{firstLab.duration}</span><span>{firstLab.level}</span></div>
          <button onClick={() => openLab(firstLab.id)}>查看完整实验步骤 <ArrowRight size={16} /></button>
        </section>
      </div>

      <section className="home-section">
        <SectionHead eyebrow="课程目录" title="按领域学习" action={<button className="text-link" onClick={() => navigate('map')}>查看知识地图 <ArrowUpRight size={15} /></button>} />
        <div className="module-grid">
          {modules.map((module) => {
            const done = module.topics.filter((topic) => progress[topic.id]).length;
            return <button className={`module-card tone-${(module.order % 4) + 1}`} key={module.id} onClick={() => openModule(module.id)}>
              <div className="module-card-top"><span className="module-icon"><ModuleIcon module={module} /></span><em>{String(module.order).padStart(2, '0')}</em></div>
              <small>{module.layer} · {module.level}</small><h3>{module.title}</h3><p>{module.brief}</p>
              <div className="module-card-foot"><span>{module.topics.length} 节微课 · 建议 {module.hours} 小时</span><span className="mini-progress"><i style={{ width: `${done / module.topics.length * 100}%` }} /></span></div>
            </button>;
          })}
        </div>
      </section>

      <div className="home-bottom-grid">
        <section className="home-section">
          <SectionHead eyebrow="精选阅读" title="参考资料" action={<button className="text-link" onClick={() => openResources()}>查看全部 {resources.length} 条 <ArrowUpRight size={15} /></button>} />
          <div className="featured-resources">
            {featured.map((item) => <a key={item.id} href={item.url} target="_blank" rel="noreferrer">
              <span className="resource-type">{item.type}</span><div><h3>{item.title}</h3><p>{item.description}</p><small>{modules.find((module) => module.id === item.category)?.title} · {item.lang}</small></div><ArrowUpRight size={18} />
            </a>)}
          </div>
        </section>
        <section className="home-section recent-notes">
          <SectionHead eyebrow="学习工具" title="笔记模板" action={<button className="text-link" onClick={() => navigate('notes')}>全部笔记 <ArrowUpRight size={15} /></button>} />
          {builtInNotes.filter((note) => note.id !== 'start-here').slice(0, 3).map((note) => <button key={note.id} onClick={() => openNote(note.id)}>
            <FileText size={19} /><span><strong>{note.title}</strong><small>{note.summary}</small></span><ChevronRight size={17} />
          </button>)}
        </section>
      </div>
    </>
  );
}

function StartPage({ navigate, openModule, openTopic, openLab, openResources }) {
  const foundation = modules.find((module) => module.id === 'foundations');
  const stack = [
    { number: '05', title: '应用与效果', text: 'RAG、Agent、评测、反馈与风险治理', moduleId: 'rag' },
    { number: '04', title: '训练与推理', text: '并行、通信、KV Cache、服务与容量', moduleId: 'inference' },
    { number: '03', title: '平台与可观测', text: '容器、Kubernetes、调度、指标与故障恢复', moduleId: 'platform' },
    { number: '02', title: '系统与硬件', text: '操作系统、GPU、内存、网络与 Kernel', moduleId: 'systems' },
    { number: '01', title: '学习先修能力', text: 'Linux、Python、训练循环与可复现实验', moduleId: 'foundations' },
  ];
  const loop = [
    { icon: BookOpen, step: '01', title: '读站内微课', text: '先用 12–20 分钟理解核心概念和它们之间的关系。' },
    { icon: LibraryBig, step: '02', title: '看视频与博客', text: '按推荐顺序补充直观讲解、工程经验和官方细节。' },
    { icon: FlaskConical, step: '03', title: '做可验证练习', text: '完成一个小任务，并对照预期结果和常见误区。' },
    { icon: CircleHelp, step: '04', title: '自测再标记', text: '先口头回答关键问题，再看参考答案并记录进度。' },
  ];
  const firstWeek = [
    { day: '练习 01', title: '命令行与 Git', text: '会进入目录、查看日志并保存一次版本提交。', topicId: 'base-linux' },
    { day: '练习 02', title: 'Python 与张量', text: '建立虚拟环境，看懂 shape、dtype 和 device。', topicId: 'base-python' },
    { day: '练习 03', title: '第一个训练循环', text: '串起预测、loss、梯度和优化器更新。', topicId: 'base-ml' },
    { day: '练习 04', title: '可复现实验', text: '固定种子，保存环境，一次只改变一个变量。', topicId: 'base-workflow' },
    { day: '练习 05', title: 'CPU 训练实验', text: '训练得到 w ≈ 3、b ≈ 1，再比较不同学习率的结果。', labId: 'lab-first-train' },
    { day: '练习 06', title: '进入系统基础', text: '开始理解进程、线程与异步 I/O。', moduleId: 'systems', topicId: 'sys-os' },
    { day: '练习 07', title: '复盘与整理', text: '写下已掌握、仍困惑和下周要验证的问题。', page: 'notes' },
  ];
  return (
    <>
      <section className="start-hero">
        <div className="start-hero-copy">
          <div className="eyebrow">入门指南</div>
          <h1>从命令行开始，<br /><span>运行第一个训练程序。</span></h1>
          <p>先修课介绍 Linux、Python 和训练循环。下面列出了学习顺序和一个 CPU 实验；熟悉的内容可以跳过，练习所需时间按自己的进度安排。</p>
          <div className="hero-actions"><button className="btn btn-primary" onClick={() => openTopic('foundations', 'base-linux')}>开始第一课 <ArrowRight size={17} /></button><button className="btn btn-ghost" onClick={() => openLab('lab-first-train')}>查看 CPU 实验 <FlaskConical size={17} /></button></div>
          <div className="start-promises"><span><Check size={14} />中文站内讲解</span><span><Check size={14} />明确学习顺序</span><span><Check size={14} />每节都有自测</span></div>
        </div>
        <aside className="start-hero-card"><span>入门安排</span><strong>每次预留 30–60 分钟</strong><p>从环境配置到训练结果，分七次练习。安装依赖或排查错误可能需要额外时间。</p><div><b>4</b><small>节先修微课</small><b>1</b><small>个 CPU 实验</small></div><button onClick={() => document.getElementById('first-week')?.scrollIntoView({ behavior: 'smooth' })}>查看练习安排 <ChevronDown size={15} /></button></aside>
      </section>

      <section className="start-section">
        <SectionHead eyebrow="内容范围" title="AI Infra 到底在做什么？" />
        <p className="start-section-intro">AI Infra 包括训练和运行模型所需的硬件、软件及服务。下面按层列出相关主题，点击可查看课程。</p>
        <div className="start-stack">{stack.map((item) => <button key={item.number} onClick={() => openModule(item.moduleId)}><span>{item.number}</span><div><strong>{item.title}</strong><p>{item.text}</p></div><ArrowUpRight size={18} /></button>)}</div>
      </section>

      <section className="start-section">
        <SectionHead eyebrow="第 0 步 / 先修课" title="四节先修课" action={<button className="text-link" onClick={() => openModule('foundations')}>查看先修模块 <ArrowUpRight size={15} /></button>} />
        <div className="foundation-grid">{foundation.topics.map((topic, index) => <button key={topic.id} onClick={() => openTopic('foundations', topic.id)}><div><span>00.{index + 1}</span><em><Clock3 size={13} />{lessons[topic.id].minutes} 分钟</em></div><h3>{topic.title}</h3><p>{topic.summary}</p><strong>开始学习 <ArrowRight size={15} /></strong></button>)}</div>
      </section>

      <section className="start-section learning-loop-section">
        <SectionHead eyebrow="课程用法" title="阅读、练习与自测" />
        <div className="learning-loop">{loop.map((item) => { const Icon = item.icon; return <article key={item.step}><div><Icon size={21} /><span>{item.step}</span></div><h3>{item.title}</h3><p>{item.text}</p></article>; })}</div>
        <div className="start-example"><BookOpen size={20} /><p><strong>打开课程后：</strong>使用“学知识 / 做练习 / 看资料”三个标签页。可按需要选择参考资料。</p><button onClick={() => openTopic('foundations', 'base-python')}>试试看 <ArrowRight size={15} /></button></div>
      </section>

      <section className="start-section" id="first-week">
        <SectionHead eyebrow="参考安排" title="七次入门练习" />
        <div className="week-plan">{firstWeek.map((item) => <button key={item.day} onClick={() => item.labId ? openLab(item.labId) : item.topicId ? openTopic(item.moduleId || 'foundations', item.topicId) : navigate(item.page)}><span>{item.day}</span><h3>{item.title}</h3><p>{item.text}</p><ArrowUpRight size={16} /></button>)}</div>
      </section>

      <section className="no-gpu-panel"><div><span><Cpu size={22} /></span><div><div className="eyebrow">实验环境</div><h2>入门实验使用 CPU</h2><p>实验 00 用 PyTorch 训练一个线性回归模型，无需 GPU。后续涉及 CUDA、多卡训练和推理服务的实验，请先查看各自的硬件要求。</p></div></div><div><button className="btn btn-primary" onClick={() => openLab('lab-first-train')}>开始 CPU 实验 <ArrowRight size={16} /></button><button className="btn btn-ghost" onClick={() => openResources()}>浏览学习资料 <LibraryBig size={16} /></button></div></section>
    </>
  );
}

function CurriculumPage({ selectedModuleId, setSelectedModuleId, progress, setProgress, setTopicDetail, openResources, assessmentRecords, setAssessmentRecords }) {
  const [assessmentPathId, setAssessmentPathId] = useState(null);
  const selected = modules.find((module) => module.id === selectedModuleId) || modules[0];
  const selectedDone = selected.topics.filter((topic) => progress[topic.id]).length;
  const assessmentPath = learningPaths.find((path) => path.id === assessmentPathId);
  return (
    <>
      <PageTitle eyebrow="循序渐进" title="学习路径"
        description="课程分为七个阶段，每阶段附一个项目和五道自测题。周数仅供参考，可以根据基础和可用时间调整。" />
      <section className="path-rail" aria-label="七个学习阶段">
        {learningPaths.map((path) => {
          const pathTopics = modules.filter((module) => path.moduleIds.includes(module.id)).flatMap((module) => module.topics);
          const done = pathTopics.filter((topic) => progress[topic.id]).length;
          const record = assessmentRecords[path.id];
          return <article key={path.id}>
            <div className="path-top"><span>{path.phase}</span><em>{path.duration}</em></div>
            <h3>{path.title}</h3><p>{path.goal}</p>
            <div className="path-modules">{path.moduleIds.map((id) => <button key={id} onClick={() => {
              setSelectedModuleId(id); document.getElementById('module-workbench')?.scrollIntoView({ behavior: 'smooth' });
            }}>{modules.find((module) => module.id === id)?.title}</button>)}</div>
            <div className="path-project"><FlaskConical size={15} /><span>{path.project}</span></div>
            <button className={`path-assessment-open ${record?.passed ? 'is-passed' : ''}`} onClick={() => setAssessmentPathId(path.id)} aria-label={`打开${path.title}综合项目与结业测验`}>
              <ListChecks size={18} />
              <span><strong>综合项目＋结业测验</strong><small>{record ? `最高 ${record.bestScore} 分 · 已作答 ${record.attempts} 次${record.passed ? ' · 已通过' : ''}` : '4 步项目 · 5 道选择题 · 80 分通过'}</small></span>
              {record?.passed ? <CheckCircle2 size={18} /> : <ArrowRight size={17} />}
            </button>
            <div className="path-progress"><i style={{ width: `${done / pathTopics.length * 100}%` }} /><span>{done}/{pathTopics.length}</span></div>
          </article>;
        })}
      </section>

      <section className="module-workbench" id="module-workbench">
        <div className="module-index">
          <div className="module-index-title">知识领域 <span>{modules.length}</span></div>
          {modules.map((module) => {
            const done = module.topics.filter((topic) => progress[topic.id]).length;
            return <button key={module.id} className={selected.id === module.id ? 'active' : ''} onClick={() => setSelectedModuleId(module.id)}>
              <span>{String(module.order).padStart(2, '0')}</span><ModuleIcon module={module} size={18} /><strong>{module.title}</strong>
              {done === module.topics.length ? <CheckCircle2 size={16} className="done-icon" /> : <em>{done}/{module.topics.length}</em>}
            </button>;
          })}
        </div>
        <div className="module-detail">
          <div className="module-detail-hero">
            <div><div className="eyebrow">{String(selected.order).padStart(2, '0')} / {selected.en}</div><h2>{selected.title}</h2><p>{selected.description}</p></div>
            <div className="module-detail-stat"><ProgressRing value={Math.round(selectedDone / selected.topics.length * 100)} size={82} /><span>{selected.hours} 小时建议投入</span></div>
          </div>
          <div className="outcome-row">{selected.outcomes.map((outcome, index) => <div key={outcome}><span>0{index + 1}</span><p>{outcome}</p></div>)}</div>
          <div className="topic-list">
            {selected.topics.map((topic, index) => <article key={topic.id} className={progress[topic.id] ? 'is-done' : ''}>
              <button className="topic-check" aria-label={progress[topic.id] ? '标记为未完成' : '标记为已完成'} onClick={() => setProgress((state) => ({ ...state, [topic.id]: !state[topic.id] }))}>
                {progress[topic.id] ? <CheckCircle2 size={23} /> : <Circle size={23} />}
              </button>
              <button className="topic-main" onClick={() => setTopicDetail({ module: selected, topic })}>
                <span>TOPIC {String(index + 1).padStart(2, '0')}</span><h3>{topic.title}</h3><p>{topic.summary}</p>
                <blockquote>{topic.question}</blockquote>
              </button>
              <button className="icon-btn topic-open" onClick={() => setTopicDetail({ module: selected, topic })} aria-label="打开主题详情"><ArrowUpRight size={18} /></button>
            </article>)}
          </div>
          <button className="related-resources-link" onClick={() => openResources(selected.id)}><LibraryBig size={18} />查看「{selected.title}」相关资源<ArrowRight size={17} /></button>
        </div>
      </section>
      {assessmentPath && <StageAssessment path={assessmentPath} assessment={stageAssessments[assessmentPath.id]}
        record={assessmentRecords[assessmentPath.id]} setAssessmentRecords={setAssessmentRecords}
        onClose={() => setAssessmentPathId(null)} onReview={(detail) => { setAssessmentPathId(null); setTopicDetail(detail); }} />}
    </>
  );
}

function projectReportMarkdown(path, assessment) {
  const { project } = assessment;
  return `# ${path.phase} ${path.title}｜综合项目记录\n\n## ${project.title}\n\n${project.subtitle}\n\n- 建议时长：${project.duration}\n- 环境：${project.environment}\n- 开始日期：\n- 完成日期：\n- 代码或文件位置：\n\n## 项目任务\n\n${project.brief}\n\n## 实施与验证\n\n${project.steps.map((step, index) => `### ${index + 1}. ${step.title}\n\n- 操作：${step.detail}\n- 验收标准：${step.expected}\n- [ ] 已完成\n- 实际过程与命令：\n- 结果位置（文件、数据或截图）：\n- 偏差与处理：`).join('\n\n')}\n\n## 交付物核对\n\n${project.deliverables.map((item) => `- [ ] ${item}：`).join('\n')}\n\n## 自评记录（总分 100）\n\n| 维度 | 分值 | 评分说明 | 自评 | 证据 |\n| --- | ---: | --- | ---: | --- |\n${project.rubric.map((row) => `| ${row.item} | ${row.points} | ${row.description} |  |  |`).join('\n')}\n\n## 结业复盘\n\n### 数据支持了什么结论？\n\n### 哪些结果没有达到预期？\n\n### 还有哪些未知项？下一步如何验证？\n`;
}

function StageAssessment({ path, assessment, record, setAssessmentRecords, onClose, onReview }) {
  const [tab, setTab] = useState('project');
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const dialogRef = useRef(null);
  const resultRef = useRef(null);
  const { project, quiz } = assessment;
  const answeredCount = quiz.filter((question) => Number.isInteger(answers[question.id])).length;

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector('button')?.focus();
    function onKeyDown(event) {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab') return;
      const focusable = [...(dialogRef.current?.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href], [tabindex="0"]') || [])];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, []);
  useEffect(() => { if (result) resultRef.current?.focus(); }, [result]);

  function submitQuiz(event) {
    event.preventDefault();
    if (answeredCount !== quiz.length || result) return;
    const correct = quiz.filter((question) => answers[question.id] === question.answer).length;
    const score = Math.round(correct / quiz.length * 100);
    const passed = score >= QUIZ_PASS_SCORE;
    const now = new Date().toISOString();
    setResult({ score, correct, passed, answers: { ...answers } });
    setAssessmentRecords((state) => {
      const previous = state[path.id] || {};
      const everPassed = Boolean(previous.passed || passed);
      return { ...state, [path.id]: {
        bestScore: Math.max(previous.bestScore ?? 0, score), lastScore: score,
        attempts: (previous.attempts || 0) + 1, passed: everPassed,
        completedAt: everPassed ? previous.completedAt || now : null,
        lastAttemptAt: now, lastAnswers: { ...answers },
      } };
    });
  }
  function retryQuiz() {
    setAnswers({}); setResult(null);
    dialogRef.current?.querySelector('.assessment-body')?.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function reviewTopic(topicId) {
    const item = ALL_TOPICS.find((topic) => topic.id === topicId);
    if (!item) return;
    onReview({ module: item.module, topic: item.module.topics.find((topic) => topic.id === topicId) });
  }

  return <div className="modal-backdrop assessment-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialogRef} className="stage-assessment modal-card" role="dialog" aria-modal="true" aria-labelledby="assessment-title">
      <header className="assessment-head">
        <div><span>{path.phase} / STAGE ASSESSMENT</span><h2 id="assessment-title">{path.title}</h2><p>把阶段知识合成一份可验证的作品，再检查关键概念。</p></div>
        <button className="icon-btn" onClick={onClose} aria-label="关闭阶段考核"><X size={21} /></button>
      </header>
      <div className="assessment-tabs" role="tablist" aria-label="阶段考核内容">
        <button id={`${path.id}-project-tab`} role="tab" aria-selected={tab === 'project'} aria-controls={`${path.id}-project-panel`} className={tab === 'project' ? 'active' : ''} onClick={() => setTab('project')}><FlaskConical size={17} />综合项目<span>4 步</span></button>
        <button id={`${path.id}-quiz-tab`} role="tab" aria-selected={tab === 'quiz'} aria-controls={`${path.id}-quiz-panel`} className={tab === 'quiz' ? 'active' : ''} onClick={() => setTab('quiz')}><ListChecks size={17} />结业测验<span>5 题</span>{record?.passed && <CheckCircle2 size={15} className="assessment-tab-passed" />}</button>
      </div>
      <div className="assessment-body">
        {tab === 'project' && <div id={`${path.id}-project-panel`} role="tabpanel" aria-labelledby={`${path.id}-project-tab`} className="assessment-project">
          <section className="project-overview">
            <span>COMPREHENSIVE PROJECT</span><h3>{project.title}</h3><h4>{project.subtitle}</h4><p>{project.brief}</p>
            <div className="project-meta"><span><Clock3 size={16} />{project.duration}</span><span><SquareTerminal size={16} />{project.environment}</span></div>
          </section>
          <section className="project-section"><div className="assessment-section-title"><span>01</span><div><h3>按四步完成并验证</h3><p>在记录模板中保存每一步的命令、输出和遇到的问题。</p></div></div>
            <div className="project-steps">{project.steps.map((step, index) => <article key={step.title} className="project-step">
              <div className="project-step-head"><span>{String(index + 1).padStart(2, '0')}</span><h4>{step.title}</h4></div><p>{step.detail}</p>
              <div className="project-expected"><CheckCircle2 size={17} /><div><strong>验收标准</strong><p>{step.expected}</p></div></div>
            </article>)}</div>
          </section>
          <div className="project-evidence-grid">
            <section className="project-deliverables"><div className="assessment-section-title"><span>02</span><div><h3>交付物清单</h3><p>在记录模板中填写文件或结果的位置。</p></div></div>
              <ul>{project.deliverables.map((item) => <li key={item}><Circle size={15} /><span>{item}</span></li>)}</ul>
            </section>
            <section className="project-rubric"><div className="assessment-section-title"><span>03</span><div><h3>项目自评标准</h3><p>对照实际结果评分，总分 100 分。</p></div></div>
              <div>{project.rubric.map((row) => <article key={row.item}><div><strong>{row.item}</strong><span>{row.points} 分</span></div><p>{row.description}</p></article>)}</div>
              <footer><span>合计</span><strong>{project.rubric.reduce((sum, row) => sum + row.points, 0)} 分</strong></footer>
            </section>
          </div>
          <div className="assessment-download"><FileText size={22} /><div><strong>把过程写成可复现的项目报告</strong><p>模板已包含四步验收、交付清单、评分标准和复盘问题。</p></div><button className="btn btn-primary" onClick={() => downloadFile(`${path.id}-综合项目记录.md`, projectReportMarkdown(path, assessment), 'text/markdown;charset=utf-8')}><Download size={16} />下载项目记录模板</button></div>
          <button className="assessment-to-quiz" onClick={() => setTab('quiz')}><span><ListChecks size={19} /><span><strong>项目完成后，检查阶段理解</strong><small>进入 5 题结业测验 · {QUIZ_PASS_SCORE} 分通过</small></span></span><ArrowRight size={19} /></button>
        </div>}

        {tab === 'quiz' && <div id={`${path.id}-quiz-panel`} role="tabpanel" aria-labelledby={`${path.id}-quiz-tab`} className="assessment-quiz">
          <div className="assessment-quiz-intro"><div><span>FINAL QUIZ</span><h3>五题结业测验</h3><p>每题 20 分，答对至少 4 题通过。提交后可看解析，错题能直接回到对应微课。</p></div><strong>{answeredCount}<small> / {quiz.length} 已答</small></strong></div>
          {record && <div className="quiz-history" aria-label="历史测验成绩"><div><span>历史最高</span><strong>{record.bestScore}<small> 分</small></strong></div><div><span>最近得分</span><strong>{record.lastScore}<small> 分</small></strong></div><div><span>作答次数</span><strong>{record.attempts}<small> 次</small></strong></div><em className={record.passed ? 'passed' : ''}>{record.passed ? <><CheckCircle2 size={15} />已通过</> : '尚未通过'}</em></div>}
          {result && <section ref={resultRef} tabIndex={-1} className={`quiz-result ${result.passed ? 'is-passed' : 'is-retry'}`} aria-live="polite">
            {result.passed ? <CheckCircle2 size={30} /> : <RotateCcw size={28} />}<div><span>{result.passed ? '阶段测验已通过' : '再复习一下，然后重试'}</span><strong>{result.score}<small> / 100 分</small></strong><p>答对 {result.correct} / {quiz.length} 题。{result.passed ? '最高分与通过状态已保存，可继续完成综合项目。' : `达到 ${QUIZ_PASS_SCORE} 分即可通过，错题下方已给出复习入口。`}</p></div>
          </section>}
          <form onSubmit={submitQuiz} className="quiz-form">
            {quiz.map((question, questionIndex) => {
              const selectedAnswer = result ? result.answers[question.id] : answers[question.id];
              const isCorrect = result && selectedAnswer === question.answer;
              const review = ALL_TOPICS.find((topic) => topic.id === question.topicId);
              return <fieldset key={question.id} className={`assessment-question ${result ? isCorrect ? 'is-correct' : 'is-wrong' : ''}`}>
                <legend><span>Q{questionIndex + 1}</span>{question.question}</legend>
                <div className="assessment-options">{question.options.map((option, optionIndex) => {
                  const selectedOption = selectedAnswer === optionIndex;
                  const correctOption = result && question.answer === optionIndex;
                  const wrongOption = result && selectedOption && !correctOption;
                  return <label key={option} className={`assessment-option ${selectedOption ? 'is-selected' : ''} ${correctOption ? 'is-correct' : ''} ${wrongOption ? 'is-wrong' : ''}`}>
                    <input type="radio" name={question.id} value={optionIndex} checked={selectedOption || false} disabled={Boolean(result)} onChange={() => setAnswers((state) => ({ ...state, [question.id]: optionIndex }))} />
                    <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span><span className="option-copy">{option}</span>
                    {correctOption && <CheckCircle2 size={18} />}{wrongOption && <X size={18} />}
                  </label>;
                })}</div>
                {result && <div className={`quiz-explanation ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
                  <strong>{isCorrect ? '回答正确' : `回答错误 · 正确答案：${String.fromCharCode(65 + question.answer)}`}</strong><p>{question.explanation}</p>
                  {!isCorrect && review && <button type="button" onClick={() => reviewTopic(question.topicId)}><BookOpen size={16} />复习对应微课：{review.title}<ArrowRight size={15} /></button>}
                </div>}
              </fieldset>;
            })}
            <div className="quiz-submit-bar">
              <div><strong>{result ? '本次作答已提交' : answeredCount === quiz.length ? '已完成全部题目，可以提交' : `还有 ${quiz.length - answeredCount} 题未作答`}</strong><span>成绩只保存在当前浏览器，可随学习备份导出。</span></div>
              {result ? <button type="button" className="btn btn-ghost" onClick={retryQuiz}><RotateCcw size={16} />重新作答</button> : <button type="submit" className="btn btn-primary" disabled={answeredCount !== quiz.length}><CheckCircle2 size={17} />提交并查看成绩</button>}
            </div>
          </form>
        </div>}
      </div>
    </section>
  </div>;
}

function MapPage({ openModule, openResources }) {
  const [activeLayer, setActiveLayer] = useState(stackLayers[0].id);
  const layer = stackLayers.find((item) => item.id === activeLayer) || stackLayers[0];
  const paths = [
    { icon: Network, title: '训练变慢或不扩展', text: '从数据、并行、通信到 straggler 逐层定位。', layerId: 'train' },
    { icon: Zap, title: '推理延迟或成本过高', text: '拆解 TTFT、TPOT、缓存、调度与容量。', layerId: 'serve' },
    { icon: Boxes, title: 'GPU 很多却总不够用', text: '检查碎片、队列、隔离、利用率和成本分摊。', layerId: 'platform' },
    { icon: ScanSearch, title: 'RAG / Agent 不稳定', text: '把检索、生成、工具和反馈分层评估。', layerId: 'app' },
  ];
  return (
    <>
      <PageTitle eyebrow="建立整体认识" title="知识地图"
        description="查看应用、推理、训练、运行时和硬件之间的关系。也可以从遇到的问题出发，找到需要补学的知识。" />
      <div className="atlas-layout">
        <section className="atlas-stack">
          <div className="atlas-stack-head"><span>AI INFRASTRUCTURE / FULL STACK</span><Layers3 size={20} /></div>
          {stackLayers.map((item, index) => <button key={item.id} className={activeLayer === item.id ? 'active' : ''} onClick={() => setActiveLayer(item.id)}>
            <span className="stack-index">0{stackLayers.length - index}</span>
            <span className="stack-name"><small>{item.en}</small><strong>{item.name}</strong></span>
            <span className="stack-items">{item.items.map((text) => <em key={text}>{text}</em>)}</span>
            <ChevronRight size={20} />
          </button>)}
          <div className="atlas-axis"><span>更靠近业务</span><i /><span>更靠近硬件</span></div>
        </section>
        <aside className="atlas-detail">
          <div className="eyebrow">当前层级</div><h2>{layer.name}</h2>
          <p>这一层包含 {layer.moduleIds.length} 个领域，可查看课程或相关资料。</p>
          <div className="atlas-module-list">
            {layer.moduleIds.map((id) => {
              const module = modules.find((item) => item.id === id);
              return <article key={id}><div className="module-icon"><ModuleIcon module={module} /></div><small>{module.en}</small><h3>{module.title}</h3><p>{module.brief}</p>
                <div><button onClick={() => openModule(id)}>学习主题 <ArrowRight size={14} /></button><button onClick={() => openResources(id)}>资源 <LibraryBig size={14} /></button></div>
              </article>;
            })}
          </div>
        </aside>
      </div>
      <section className="home-section problem-section">
        <SectionHead eyebrow="问题索引" title="按问题查找" />
        <div className="problem-grid">{paths.map((path) => {
          const Icon = path.icon;
          return <button key={path.title} onClick={() => { setActiveLayer(path.layerId); document.querySelector('.atlas-layout')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <Icon size={23} /><h3>{path.title}</h3><p>{path.text}</p><span>定位相关层级 <ArrowUpRight size={15} /></span>
          </button>;
        })}</div>
      </section>
    </>
  );
}

function ResourcesPage({ focus, bookmarks, toggleBookmark }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [type, setType] = useState('全部类型');
  const [level, setLevel] = useState('全部难度');
  const [language, setLanguage] = useState('全部语言');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [limit, setLimit] = useState(24);
  useEffect(() => {
    if (!focus?.nonce) return;
    setQuery(focus.query || ''); setCategory(focus.category || 'all'); setLanguage('全部语言'); setLimit(24);
  }, [focus]);
  const filtered = useMemo(() => resources.filter((item) => {
    const haystack = `${item.title} ${item.description} ${item.type} ${item.lang} ${modules.find((module) => module.id === item.category)?.title}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (category === 'all' || item.category === category)
      && (type === '全部类型' || item.type === type) && (level === '全部难度' || item.level === level)
      && (language === '全部语言' || item.lang === language) && (!bookmarkedOnly || bookmarks.includes(item.id));
  }), [query, category, type, level, language, bookmarkedOnly, bookmarks]);
  useEffect(() => { setLimit(24); }, [query, category, type, level, language, bookmarkedOnly]);
  function reset() { setQuery(''); setCategory('all'); setType('全部类型'); setLevel('全部难度'); setLanguage('全部语言'); setBookmarkedOnly(false); }
  return (
    <>
      <PageTitle eyebrow="学习资源" title="资源库"
        description={`共 ${resources.length} 条视频、博客、书籍、文档和论文，可按领域、语言、难度和类型筛选。`}
        actions={<button className={`btn ${bookmarkedOnly ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setBookmarkedOnly(!bookmarkedOnly)}><Bookmark size={16} />我的收藏 <span>{bookmarks.length}</span></button>} />
      <section className="library-controls">
        <label className="library-search"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索 vLLM、FSDP、NCCL、量化…" />{query && <button onClick={() => setQuery('')} aria-label="清空搜索"><X size={17} /></button>}</label>
        <div className="filter-row">
          <label><span>知识领域</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">全部领域</option>{modules.map((module) => <option value={module.id} key={module.id}>{module.title}</option>)}</select><ChevronDown size={15} /></label>
          <label><span>资料语言</span><select value={language} onChange={(event) => setLanguage(event.target.value)}>{RESOURCE_LANGUAGES.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></label>
          <label><span>难度</span><select value={level} onChange={(event) => setLevel(event.target.value)}><option>全部难度</option><option>入门</option><option>进阶</option><option>深入</option></select><ChevronDown size={15} /></label>
          <button className="reset-filter" onClick={reset}><RotateCcw size={15} />重置筛选</button>
        </div>
        <div className="type-chips">{RESOURCE_TYPES.map((item) => <button key={item} className={type === item ? 'active' : ''} onClick={() => setType(item)}>{item}</button>)}</div>
      </section>
      <div className="library-result-head"><span><strong>{filtered.length}</strong> 条结果{bookmarkedOnly && ' · 仅看收藏'}</span><span>按收录顺序排列</span></div>
      {filtered.length ? <div className="resource-grid">{filtered.slice(0, limit).map((item) => {
        const module = modules.find((entry) => entry.id === item.category);
        const saved = bookmarks.includes(item.id);
        return <article className="resource-card" key={item.id}>
          <div className="resource-card-top"><span>{item.type}</span><button className={saved ? 'saved' : ''} onClick={() => toggleBookmark(item.id)} aria-label={saved ? '取消收藏' : '收藏'}>{saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}</button></div>
          <div className="resource-domain"><ModuleIcon module={module} size={16} />{module.title}</div>
          <h2><a href={item.url} target="_blank" rel="noreferrer">{item.title}</a></h2><p>{item.description}</p>
          <div className="resource-card-foot"><span>{item.level} · {item.lang}</span><a href={item.url} target="_blank" rel="noreferrer" aria-label={`打开 ${item.title}`}><ArrowUpRight size={18} /></a></div>
        </article>;
      })}</div> : <EmptyState title="没有找到匹配资料" description="试试更短的关键词，或清除领域、语言与难度筛选。" action={<button className="btn btn-primary" onClick={reset}>清除筛选</button>} />}
      {limit < filtered.length && <button className="load-more" onClick={() => setLimit((value) => value + 24)}>再显示 {Math.min(24, filtered.length - limit)} 条<ChevronDown size={17} /></button>}
      <div className="library-note"><ShieldCheck size={17} /><p>链接会在新标签页打开，资料版本、正文与可用性以原站点为准。收藏只保存在当前浏览器，可以在“设置与备份”中导出。</p></div>
    </>
  );
}

function CodeBlock({ code, title = '在终端执行', language = 'bash' }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopied(true);
  }
  return <div className="code-block">
    <div className="code-block-head"><span><SquareTerminal size={14} />{title}<em>{language}</em></span><button onClick={copyCode} aria-label={copied ? '已复制' : `复制${title}`}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? '已复制' : '复制'}</button></div>
    <pre tabIndex="0"><code>{code}</code></pre>
  </div>;
}

function labReportMarkdown(lab, guide) {
  return `# ${lab.title}｜实验记录\n\n## 实验环境\n\n- 日期：\n- 机器 / GPU：\n- 操作系统与驱动：\n- 软件版本：\n- 实验参数：\n\n## 实验目标\n\n${lab.goal}\n\n## 操作记录\n\n${lab.steps.map((step, index) => `### ${index + 1}. ${step.title}\n\n- [ ] 已完成\n- 实际执行的命令或配置：\n- 观察到的结果：\n- 遇到的问题：`).join('\n\n')}\n\n## 结果数据\n\n| 指标 | 结果 | 备注 |\n| --- | --- | --- |\n${lab.metrics.map((metric) => `| ${metric} |  |  |`).join('\n')}\n\n## 结论\n\n### 数据支持了什么结论？\n\n### 还有哪些现象无法解释？\n\n### 下一步要验证什么？\n\n## 安全与清理\n\n${guide.cleanup || '确认临时进程已停止，按需删除临时文件。'}\n`;
}

function LabsPage({ selectedLabId, setSelectedLabId, labProgress, setLabProgress, openModule, showToast }) {
  const lab = labs.find((item) => item.id === selectedLabId) || labs[0];
  const guide = labGuides[lab.id] || { requirements: [], steps: [], troubleshooting: [] };
  const completed = (labProgress[lab.id] || []).filter((index) => index < lab.steps.length);
  const percentage = Math.round(completed.length / lab.steps.length * 100);
  const labIndex = labs.findIndex((item) => item.id === lab.id);
  function toggleStep(index) {
    setLabProgress((state) => {
      const current = state[lab.id] || [];
      return { ...state, [lab.id]: current.includes(index) ? current.filter((item) => item !== index) : [...current, index] };
    });
  }
  function selectLab(id) {
    setSelectedLabId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function resetProgress() {
    if (!window.confirm(`确定清空「${lab.title}」的步骤勾选吗？实验文件不会受影响。`)) return;
    setLabProgress((state) => ({ ...state, [lab.id]: [] }));
    showToast('已清空本实验的完成记录');
  }
  return (
    <>
      <PageTitle eyebrow="实验教程" title="动手实验"
        description="选择与你的环境匹配的实验，按顺序复制命令、检查结果并保存数据。勾选已完成的步骤可保存进度。" />
      <div className="lab-workspace">
        <section className="lab-manual">
          <div className="lab-manual-head"><div><span>实验 {lab.number} · {lab.level}</span><h2>{lab.title}</h2><p>{lab.subtitle}</p></div><ProgressRing value={percentage} size={82} /></div>
          <div className="lab-info-row"><span><Clock3 size={16} />{lab.duration}</span><span><SquareTerminal size={16} />{lab.environment}</span><button onClick={() => openModule(lab.moduleId)}>先学相关知识 <ArrowUpRight size={15} /></button></div>
          <div className="lab-goal"><span>实验目标</span><p>{lab.goal}</p></div>

          <section className="lab-prepare">
            <div className="lab-section-title"><div><span>开始前</span><h3>检查环境与注意事项</h3></div><ListChecks size={21} /></div>
            <ul>{guide.requirements?.map((item) => <li key={item}><Check size={15} /><span>{item}</span></li>)}</ul>
            {guide.safety && <div className="lab-safety"><AlertTriangle size={18} /><p>{guide.safety}</p></div>}
          </section>

          <section className="lab-steps">
            <div className="lab-section-title"><div><span>操作流程</span><h3>按顺序完成以下 {lab.steps.length} 步</h3></div><small>{completed.length} / {lab.steps.length} 已完成</small></div>
            {lab.steps.map((step, index) => {
              const detail = guide.steps?.[index] || {};
              const done = completed.includes(index);
              return <article key={step.title} className={`lab-step ${done ? 'done' : ''}`}>
                <button className="lab-step-head" onClick={() => toggleStep(index)} aria-pressed={done}>
                  <span className="step-check">{done ? <Check size={17} /> : index + 1}</span>
                  <span className="step-heading"><small>步骤 {index + 1}</small><strong>{step.title}</strong><span className="step-description">{step.detail}</span></span>
                  <span className="step-status">{done ? '已完成' : '标记完成'}</span>
                </button>
                <div className="lab-step-body">
                  {detail.blocks?.map((block) => <CodeBlock key={`${block.title}-${block.code.slice(0, 24)}`} {...block} />)}
                  {detail.expected && <div className="step-expected"><CheckCircle2 size={18} /><div><strong>预期结果</strong><p>{detail.expected}</p></div></div>}
                  {detail.note && <p className="step-note">{detail.note}</p>}
                </div>
              </article>;
            })}
          </section>

          <div className="lab-output"><div><BarChart3 size={20} /><h3>需要记录的结果</h3></div><ul>{lab.metrics.map((metric) => <li key={metric}>{metric}</li>)}</ul></div>
          <div className="deliverable"><FileText size={22} /><div><span>完成标准</span><h3>整理实验结果</h3><p>{lab.deliverable}</p></div><button onClick={() => downloadFile(`${lab.id}-记录模板.md`, labReportMarkdown(lab, guide), 'text/markdown;charset=utf-8')}><Download size={16} />下载记录模板</button></div>

          {guide.troubleshooting?.length > 0 && <section className="lab-troubleshooting"><div className="lab-section-title"><div><span>遇到问题</span><h3>常见错误与处理方法</h3></div><CircleHelp size={21} /></div>
            {guide.troubleshooting.map((item) => <details key={item.problem}><summary>{item.problem}<ChevronDown size={16} /></summary><p>{item.solution}</p></details>)}
          </section>}
          {guide.cleanup && <div className="lab-cleanup"><strong>实验结束后</strong><p>{guide.cleanup}</p></div>}
          <div className="lab-resources"><h3>相关文档与延伸阅读</h3><div>{lab.resourceIds.map((id) => {
            const resource = resources.find((item) => item.id === id);
            return resource ? <a href={resource.url} target="_blank" rel="noreferrer" key={id}>{resource.title}<ArrowUpRight size={14} /></a> : null;
          })}</div></div>
          <div className="lab-pagination">
            <button disabled={labIndex === 0} onClick={() => selectLab(labs[labIndex - 1]?.id)}><ChevronLeft size={16} />上一个实验</button>
            <button className="text-button" onClick={resetProgress}><RotateCcw size={14} />清空本实验勾选</button>
            <button disabled={labIndex === labs.length - 1} onClick={() => selectLab(labs[labIndex + 1]?.id)}>下一个实验<ChevronRight size={16} /></button>
          </div>
        </section>
        <aside className="lab-catalog"><div className="lab-catalog-title">实验目录 <span>{labs.length}</span></div><p className="lab-catalog-intro">按自己的硬件条件选择，不必一次全部完成。</p>{labs.map((item) => {
          const done = (labProgress[item.id] || []).filter((index) => index < item.steps.length).length;
          return <button key={item.id} className={item.id === lab.id ? 'active' : ''} onClick={() => selectLab(item.id)}><span>{item.number}</span><div><strong>{item.title}</strong><small>{item.level} · {item.duration}</small><i><em style={{ width: `${done / item.steps.length * 100}%` }} /></i></div><ChevronRight size={16} /></button>;
        })}</aside>
      </div>
    </>
  );
}

function NotesPage({ notes, selectedNoteId, setSelectedNoteId, personalNotes, setPersonalNotes, showToast }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({ title: '', tags: '', body: '' });
  const [editorOpen, setEditorOpen] = useState(false);
  const initialDraft = useRef(null);
  const dirty = editorOpen && JSON.stringify(draft) !== JSON.stringify(initialDraft.current);
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty]);
  const visible = notes.filter((note) => (filter === 'all' || (filter === 'mine' ? note.source === 'personal' : note.source === 'builtin'))
    && (!query || `${note.title} ${note.summary} ${note.body}`.toLowerCase().includes(query.toLowerCase())));
  const selected = visible.find((note) => note.id === selectedNoteId) || visible[0];
  function openEditor(note, nextDraft) {
    setEditing(note);
    initialDraft.current = nextDraft;
    setDraft(nextDraft);
    setEditorOpen(true);
  }
  function closeEditor() {
    if (dirty && !window.confirm('笔记还未保存，确定放弃这些修改吗？')) return;
    setEditorOpen(false);
    setEditing(null);
  }
  function startNew(template) {
    openEditor(template?.source === 'personal' ? template : null, template ? { title: template.source === 'personal' ? template.title : `${template.title} · 我的版本`, tags: (template.tags || []).join(', '), body: template.body } : { title: '', tags: '', body: '# 标题\n\n## 背景\n\n## 过程与数据\n\n## 结论与未知项\n' });
  }
  function startEdit(note) { openEditor(note, { title: note.title, tags: (note.tags || []).join(', '), body: note.body }); }
  function saveNote() {
    if (!draft.title.trim() || !draft.body.trim()) { showToast('请先填写标题和正文'); return; }
    const now = new Date().toISOString();
    if (editing?.source === 'personal') {
      setPersonalNotes((items) => items.map((note) => note.id === editing.id ? { ...note, title: draft.title.trim(), body: draft.body, tags: draft.tags.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean), updatedAt: now, summary: draft.body.replace(/[#*_>`|\-]/g, '').trim().slice(0, 90) } : note));
      setSelectedNoteId(editing.id);
    } else {
      const id = `my-note-${Date.now()}`;
      const note = { id, title: draft.title.trim(), body: draft.body, date: now.slice(0, 10), updatedAt: now, tags: draft.tags.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean), summary: draft.body.replace(/[#*_>`|\-]/g, '').trim().slice(0, 90), kind: '我的笔记', source: 'personal' };
      setPersonalNotes((items) => [note, ...items]); setSelectedNoteId(id); setFilter('all');
    }
    setEditorOpen(false); setEditing(null); setDraft({ title: '', tags: '', body: '' }); setQuery(''); setFilter('all'); showToast('笔记已保存到当前浏览器');
  }
  function deleteNote(note) {
    if (!window.confirm(`确定删除「${note.title}」吗？此操作只影响本机浏览器中的笔记。`)) return;
    setPersonalNotes((items) => items.filter((item) => item.id !== note.id));
    setSelectedNoteId(builtInNotes[0]?.id); showToast('笔记已删除');
  }
  return (
    <>
      <PageTitle eyebrow="学习记录" title="我的笔记"
        description="记录实验命令、结果和疑问，或从内置模板开始整理。笔记可导出为 Markdown，新增内容只保存在当前浏览器。"
        actions={<button className="btn btn-primary" onClick={() => startNew()}><Plus size={17} />新建笔记</button>} />
      <div className="notes-workspace">
        <aside className="notes-list">
          <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索笔记" /></label>
          <div className="notes-filter"><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>全部</button><button className={filter === 'mine' ? 'active' : ''} onClick={() => setFilter('mine')}>我的笔记 <span>{personalNotes.length}</span></button><button className={filter === 'builtin' ? 'active' : ''} onClick={() => setFilter('builtin')}>指南与模板</button></div>
          <div className="note-list-scroll">{visible.map((note) => <button key={note.id} className={selected?.id === note.id ? 'active' : ''} onClick={() => setSelectedNoteId(note.id)}>
            <div><span>{note.kind}</span><time>{note.date}</time></div><h3>{note.title}</h3><p>{note.summary}</p><footer>{(note.tags || []).slice(0, 2).map((tag) => <em key={tag}>{tag}</em>)}</footer>
          </button>)}{!visible.length && <EmptyState icon={NotebookPen} title="这里还没有笔记" description="新建一篇，或清除当前筛选。" />}</div>
        </aside>
        <section className="note-reader">
          {!selected && <EmptyState icon={NotebookPen} title="没有匹配的笔记" description="换一个关键词，或选择其他分类。" />}
          {selected && <><div className="note-reader-toolbar"><div><span className="note-kind">{selected.kind}</span><time>{selected.date}{selected.updatedAt && selected.source === 'personal' ? ' · 已编辑' : ''}</time></div><div>
            <button onClick={() => downloadFile(`${selected.title}.md`, noteToMarkdown(selected), 'text/markdown;charset=utf-8')} title="导出 Markdown"><Download size={17} /></button>
            {selected.source === 'personal' ? <><button onClick={() => startEdit(selected)} title="编辑"><Edit3 size={17} /></button><button className="danger" onClick={() => deleteNote(selected)} title="删除"><Trash2 size={17} /></button></> : <button onClick={() => startNew(selected)} title="以此为模板"><Copy size={17} /></button>}
          </div></div><article className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{selected.body}</ReactMarkdown></article>
            <footer className="note-reader-footer"><span>{selected.source === 'personal' ? '我的个人笔记' : 'Infra Atlas 内置内容'}</span>{selected.source === 'builtin' && <button onClick={() => startNew(selected)}>以此为模板写笔记 <ArrowRight size={15} /></button>}</footer></>}
        </section>
      </div>
      {editorOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}>
        <section className="note-editor modal-card" role="dialog" aria-modal="true" aria-labelledby="note-editor-title"><div className="modal-head"><div><span>Markdown 笔记</span><h2 id="note-editor-title">{editing ? '编辑我的笔记' : '写一篇新笔记'}</h2></div><button className="icon-btn" onClick={closeEditor} aria-label="关闭笔记编辑器"><X size={20} /></button></div>
          <div className="editor-fields"><input className="editor-title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="笔记标题" autoFocus /><input value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} placeholder="标签，用逗号分隔（如：推理, 排障）" /><textarea value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} placeholder="支持 Markdown：标题、列表、表格、代码块…" /></div>
          <div className="editor-foot"><span>{dirty ? '有未保存的修改' : 'Markdown · 保存到当前浏览器'}</span><div><button className="btn btn-ghost" onClick={closeEditor}>取消</button><button className="btn btn-primary" onClick={saveNote}><Save size={16} />保存笔记</button></div></div>
        </section>
      </div>}
    </>
  );
}

function MaintenancePage({ progress, setProgress, bookmarks, setBookmarks, personalNotes, setPersonalNotes, labProgress, setLabProgress, assessmentRecords, setAssessmentRecords, theme, setTheme, showToast, completedTopics }) {
  const fileInput = useRef(null);
  const completedLabSteps = Object.values(labProgress).reduce((total, steps) => total + steps.length, 0);
  function exportBackup() {
    const payload = { product: 'Infra Atlas', version: 1, exportedAt: new Date().toISOString(), data: { progress, bookmarks, personalNotes, labProgress, assessmentRecords, theme } };
    downloadFile(`infra-atlas-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2), 'application/json');
    showToast('学习数据备份已导出');
  }
  async function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      if (payload.product !== 'Infra Atlas' || !payload.data) throw new Error('invalid');
      if (!window.confirm('导入会替换当前浏览器中的进度、收藏、个人笔记、实验记录和测验成绩。建议先导出备份。继续吗？')) return;
      const data = payload.data;
      setProgress(data.progress || {}); setBookmarks(data.bookmarks || []); setPersonalNotes(data.personalNotes || []);
      setLabProgress(data.labProgress || {}); setAssessmentRecords(data.assessmentRecords || {});
      if (['light', 'dark'].includes(data.theme)) setTheme(data.theme);
      showToast('备份已恢复');
    } catch { showToast('无法读取：请选择本站导出的备份文件'); }
    finally { event.target.value = ''; }
  }
  return (
    <>
      <PageTitle eyebrow="个人设置" title="设置与备份"
        description="调整显示方式，管理学习记录。换浏览器或清理浏览器数据前，建议先导出一份备份。" />
      <section className="content-stats"><div><CheckCircle2 size={21} /><strong>{completedTopics}</strong><span>已完成主题</span></div><div><FlaskConical size={21} /><strong>{completedLabSteps}</strong><span>已勾选实验步骤</span></div><div><Bookmark size={21} /><strong>{bookmarks.length}</strong><span>收藏资料</span></div><div><NotebookPen size={21} /><strong>{personalNotes.length}</strong><span>我的笔记</span></div></section>
      <div className="maintenance-grid">
        <section className="panel content-guide"><SectionHead eyebrow="使用帮助" title="如何记录学习过程" />
          <div className="update-methods"><article><span>01</span><div><h3>标记已经掌握的主题</h3><p>在“学习路径”中打开主题，阅读说明和相关资料后，再将它标记为已完成。首页会显示下一次可以继续学习的内容。</p></div></article>
            <article><span>02</span><div><h3>边做实验边保存结果</h3><p>在“动手实验”中复制命令并逐步核对结果。每个实验和阶段综合项目都可以下载 Markdown 记录模板，用来保存环境、参数、数据和问题。</p></div></article>
            <article><span>03</span><div><h3>把笔记、成绩和进度一起带走</h3><p>笔记、收藏、主题进度、实验勾选和结业测验成绩都保存在当前浏览器。换设备时，先在这里导出备份，再在新设备上恢复。</p></div></article></div>
        </section>
        <aside className="panel backup-panel"><SectionHead eyebrow="学习数据" title="备份与恢复" /><div className="backup-icon"><HardDrive size={34} /></div><p>备份包含主题进度、资源收藏、实验勾选、结业测验成绩、个人笔记和显示设置。恢复备份会替换当前浏览器里的对应记录。</p>
          <button className="btn btn-primary" onClick={exportBackup}><Download size={17} />导出学习数据</button><button className="btn btn-ghost" onClick={() => fileInput.current?.click()}><Upload size={17} />从备份恢复</button>
          <input ref={fileInput} type="file" accept="application/json,.json" onChange={importBackup} hidden /><small>JSON 文件只在你的设备上处理，不会上传</small>
        </aside>
      </div>
      <div className="settings-bottom">
        <section className="settings-preferences"><div><Moon size={22} /><span><h3>显示模式</h3><p>选择阅读更舒服的配色，设置会保存在当前浏览器。</p></span></div><div className="theme-options" role="group" aria-label="显示模式"><button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}><Sun size={16} />浅色</button><button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}><Moon size={16} />深色</button></div></section>
        <section className="settings-shortcuts"><Command size={22} /><div><h3>快速找到内容</h3><p>按 <kbd>⌘</kbd> <kbd>K</kbd>（Windows 按 <kbd>Ctrl</kbd> <kbd>K</kbd>）搜索课程、资料、实验和笔记；按 <kbd>Esc</kbd> 关闭搜索。</p></div></section>
      </div>
      <div className="data-notice"><ShieldCheck size={18} /><p>学习记录不会自动同步到其他浏览器或设备。如果你使用浏览器的无痕模式，关闭窗口后记录可能无法保留。</p></div>
    </>
  );
}

function TopicDrawer({ module, topic, progress, setProgress, onClose, openResources }) {
  const [tab, setTab] = useState('learn');
  useEffect(() => { setTab('learn'); }, [topic.id]);
  const lesson = lessons[topic.id];
  const related = lesson.resourceIds.map((id) => resources.find((item) => item.id === id)).filter(Boolean);
  const done = !!progress[topic.id];
  const tabs = [
    { id: 'learn', label: '学知识', icon: BookOpen },
    { id: 'practice', label: '做练习', icon: ListChecks },
    { id: 'resources', label: '看资料', icon: LibraryBig },
  ];
  return <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <aside className="topic-drawer" role="dialog" aria-modal="true" aria-labelledby="topic-drawer-title">
      <div className="drawer-top"><span>{module.title} · 课程</span><button className="icon-btn" onClick={onClose} aria-label="关闭主题详情"><X size={20} /></button></div>
      <div className="drawer-module"><ModuleIcon module={module} size={22} />{module.title}</div><h2 id="topic-drawer-title">{topic.title}</h2><p className="drawer-summary">{topic.summary}</p>
      <div className="lesson-tabs" role="tablist" aria-label="主题学习步骤">{tabs.map((item) => { const Icon = item.icon; return <button key={item.id} id={`lesson-tab-${item.id}`} role="tab" aria-selected={tab === item.id} aria-controls={`lesson-panel-${item.id}`} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}><Icon size={16} />{item.label}{item.id === 'resources' && <span>{related.length}</span>}</button>; })}</div>

      {tab === 'learn' && <div className="drawer-tab-panel" id="lesson-panel-learn" role="tabpanel" aria-labelledby="lesson-tab-learn">
        <div className="lesson-meta"><span><Clock3 size={14} />约 {lesson.minutes} 分钟</span><span>站内微课 · 无需跳转</span></div>
        <article className="markdown-body lesson-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown></article>
        <div className="key-question"><span>思考题</span><h3>{topic.question}</h3><p>先用自己的话回答，再去练习页核对自测答案。</p></div>
        <button className="lesson-next-step" onClick={() => setTab('practice')}><span><ListChecks size={18} /><strong>读完去做一个小练习</strong></span><ArrowRight size={17} /></button>
      </div>}

      {tab === 'practice' && <div className="drawer-tab-panel" id="lesson-panel-practice" role="tabpanel" aria-labelledby="lesson-tab-practice">
        <section className="practice-card practice-task"><span>01 / 动手练习</span><h3>完成这个小任务</h3><p>{lesson.practice}</p></section>
        <section className="practice-card practice-expected"><CheckCircle2 size={20} /><div><span>02 / 如何验证</span><h3>做完应该看到什么</h3><p>{lesson.expected}</p></div></section>
        <section className="practice-card practice-pitfall"><AlertTriangle size={20} /><div><span>03 / 常见误区</span><h3>检查有没有踩坑</h3><p>{lesson.pitfall}</p></div></section>
        <section className="quiz-card"><span>自测</span><h3>{lesson.quiz.question}</h3><p>先不看答案，用自己的话完整解释一次。</p><details><summary>查看参考答案 <ChevronDown size={16} /></summary><div>{lesson.quiz.answer}</div></details></section>
        <button className="lesson-next-step" onClick={() => setTab('resources')}><span><LibraryBig size={18} /><strong>查看参考资料</strong></span><ArrowRight size={17} /></button>
      </div>}

      {tab === 'resources' && <div className="drawer-tab-panel" id="lesson-panel-resources" role="tabpanel" aria-labelledby="lesson-tab-resources">
        <div className="lesson-resource-intro"><span>按推荐顺序排列</span><p>不必一次全部看完。先选一种适合自己的形式，遇到具体问题时再查官方文档或论文。</p></div>
        <div className="lesson-resources-list">{related.map((item, index) => <a href={item.url} target="_blank" rel="noreferrer" key={item.id} className="lesson-resource-card"><span className="lesson-resource-index">{String(index + 1).padStart(2, '0')}</span><div><div className="lesson-resource-tags"><span>{item.url.includes('bilibili.com') ? 'B 站视频' : item.type}</span><em>{item.lang} · {item.level}</em></div><h3>{item.title}</h3><p>{item.description}</p></div><ArrowUpRight size={18} /></a>)}</div>
        <button className="lesson-next-step" onClick={() => { onClose(); openResources(module.id); }}><span><LibraryBig size={18} /><strong>查看「{module.title}」全部资源</strong></span><ArrowRight size={17} /></button>
      </div>}

      <button className={`btn ${done ? 'btn-ghost' : 'btn-primary'} drawer-done`} onClick={() => setProgress((state) => ({ ...state, [topic.id]: !state[topic.id] }))}>{done ? <><RotateCcw size={17} />取消完成标记</> : <><CheckCircle2 size={17} />标记这个主题已学习</>}</button>
      <p className="drawer-footnote">完成阅读、练习和自测后，可以标记进度。</p>
    </aside>
  </div>;
}

function SearchPalette({ onClose, notes, openTopic, openResources, openLab, openNote }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    const score = (text) => text.toLowerCase().includes(term);
    return [
      ...ALL_TOPICS.filter((topic) => {
        const lesson = lessons[topic.id];
        return score(`${topic.title} ${topic.summary} ${topic.question} ${topic.module.title} ${lesson.content} ${lesson.practice} ${lesson.quiz.question}`);
      }).map((topic) => ({ id: topic.id, kind: '站内微课', title: topic.title, subtitle: `${topic.module.title} · ${topic.summary}`, action: () => openTopic(topic.module, topic) })),
      ...resources.filter((item) => score(`${item.title} ${item.description} ${item.type} ${item.lang}`)).map((item) => ({ id: item.id, kind: '资源', title: item.title, subtitle: item.description, action: () => openResources(item.title) })),
      ...labs.filter((lab) => score(`${lab.title} ${lab.subtitle} ${lab.goal}`)).map((lab) => ({ id: lab.id, kind: '实验', title: lab.title, subtitle: `${lab.level} · ${lab.subtitle}`, action: () => openLab(lab.id) })),
      ...notes.filter((note) => score(`${note.title} ${note.summary} ${note.body}`)).map((note) => ({ id: note.id, kind: '笔记', title: note.title, subtitle: note.summary, action: () => openNote(note.id) })),
    ].slice(0, 12);
  }, [query, notes]);
  const suggestions = ['学习率', '分布式训练', 'KV Cache', 'GPU 调度'];
  return <div className="modal-backdrop search-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="search-palette">
    <label><Search size={22} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索全站微课、资源、实验与笔记…" /><kbd>ESC</kbd></label>
    {!query && <div className="search-start"><span>试试这些关键词</span><div>{suggestions.map((item) => <button key={item} onClick={() => setQuery(item)}>{item}</button>)}</div><p><Command size={13} /> K 随时唤起搜索 · 支持中文与英文项目名</p></div>}
    {query && <div className="search-results">{results.map((result) => <button key={`${result.kind}-${result.id}`} onClick={result.action}><span>{result.kind}</span><div><strong>{result.title}</strong><p>{result.subtitle}</p></div><ArrowRight size={17} /></button>)}{!results.length && <EmptyState title="没有找到相关内容" description="换一个关键词，或到资源库中按领域浏览。" />}</div>}
    {query && results.length > 0 && <div className="search-count">显示前 {results.length} 条结果</div>}
  </section></div>;
}

export default App;
