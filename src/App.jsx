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
import { labs } from './content/labs.js';
import { labGuides } from './content/lab-guides.js';
import { builtInNotes } from './content/notes.js';

const PAGE_IDS = ['dashboard', 'curriculum', 'map', 'resources', 'labs', 'notes', 'maintenance'];
const PAGE_META = {
  dashboard: { label: '首页', eyebrow: '学习首页' },
  curriculum: { label: '学习路径', eyebrow: '课程' },
  map: { label: '知识地图', eyebrow: '知识地图' },
  resources: { label: '资源库', eyebrow: '资源库' },
  labs: { label: '动手实验', eyebrow: '实验教程' },
  notes: { label: '我的笔记', eyebrow: '笔记' },
  maintenance: { label: '设置与备份', eyebrow: '设置' },
};
const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard },
  { id: 'curriculum', icon: BookOpen },
  { id: 'map', icon: Map },
  { id: 'resources', icon: LibraryBig },
  { id: 'labs', icon: FlaskConical },
  { id: 'notes', icon: NotebookPen },
  { id: 'maintenance', icon: Settings2 },
];
const MODULE_ICONS = {
  systems: SquareTerminal, hardware: Cpu, kernels: Braces, frameworks: Workflow,
  distributed: Network, network: Cable, data: Database, inference: Zap,
  serving: Server, platform: Boxes, observability: Activity, rag: ScanSearch,
  mlops: GitBranch, governance: ShieldCheck,
};
const RESOURCE_TYPES = ['全部类型', ...new Set(resources.map((item) => item.type))];
const ALL_TOPICS = modules.flatMap((module) => module.topics.map((topic) => ({ ...topic, module })));
const STORAGE = {
  progress: 'infra-atlas-progress-v1', bookmarks: 'infra-atlas-bookmarks-v1',
  notes: 'infra-atlas-notes-v1', labs: 'infra-atlas-labs-v1', theme: 'infra-atlas-theme-v1',
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
  const [selectedModuleId, setSelectedModuleId] = useState('systems');
  const [selectedLabId, setSelectedLabId] = useState(labs[0].id);
  const [selectedNoteId, setSelectedNoteId] = useState(builtInNotes[0]?.id);
  const [resourceFocus, setResourceFocus] = useState({ query: '', category: 'all' });
  const [progress, setProgress] = usePersistentState(STORAGE.progress, {});
  const [bookmarks, setBookmarks] = usePersistentState(STORAGE.bookmarks, []);
  const [personalNotes, setPersonalNotes] = usePersistentState(STORAGE.notes, []);
  const [labProgress, setLabProgress] = usePersistentState(STORAGE.labs, {});
  const [theme, setTheme] = usePersistentState(STORAGE.theme, 'light');
  const [toast, setToast] = useState('');

  const completedTopics = ALL_TOPICS.filter((topic) => progress[topic.id]).length;
  const overallProgress = Math.round((completedTopics / ALL_TOPICS.length) * 100);
  const allNotes = useMemo(() => [...personalNotes, ...builtInNotes], [personalNotes]);

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
    openModule={openModule} openResources={openResources} openLab={openLab} openNote={openNote} bookmarks={bookmarks} />;
  else if (activePage === 'curriculum') content = <CurriculumPage {...shared} selectedModuleId={selectedModuleId}
    setSelectedModuleId={setSelectedModuleId} setTopicDetail={setTopicDetail} openResources={openResources} />;
  else if (activePage === 'map') content = <MapPage openModule={openModule} openResources={openResources} />;
  else if (activePage === 'resources') content = <ResourcesPage focus={resourceFocus} bookmarks={bookmarks}
    toggleBookmark={toggleBookmark} />;
  else if (activePage === 'labs') content = <LabsPage selectedLabId={selectedLabId} setSelectedLabId={setSelectedLabId}
    labProgress={labProgress} setLabProgress={setLabProgress} openModule={openModule} showToast={setToast} />;
  else if (activePage === 'notes') content = <NotesPage notes={allNotes} selectedNoteId={selectedNoteId}
    setSelectedNoteId={setSelectedNoteId} personalNotes={personalNotes} setPersonalNotes={setPersonalNotes} showToast={setToast} />;
  else content = <MaintenancePage progress={progress} setProgress={setProgress} bookmarks={bookmarks}
    setBookmarks={setBookmarks} personalNotes={personalNotes} setPersonalNotes={setPersonalNotes}
    labProgress={labProgress} setLabProgress={setLabProgress} theme={theme} setTheme={setTheme}
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
          <button onClick={() => navigate('curriculum')}>继续学习 <ArrowRight size={14} /></button>
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
        openTopic={(module, topic) => { setSearchOpen(false); setTopicDetail({ module, topic }); }}
        openResources={(query) => { setSearchOpen(false); openResources('all', query); }}
        openLab={(id) => { setSearchOpen(false); openLab(id); }}
        openNote={(id) => { setSearchOpen(false); openNote(id); }} />}
      {topicDetail && <TopicDrawer {...topicDetail} progress={progress} setProgress={setProgress}
        onClose={() => setTopicDetail(null)} openResources={openResources} />}
      {toast && <div className="toast"><CheckCircle2 size={17} />{toast}</div>}
    </div>
  );
}

function Dashboard({ navigate, openModule, openResources, openLab, openNote, progress, overallProgress, completedTopics }) {
  const nextTopics = ALL_TOPICS.filter((topic) => !progress[topic.id]).slice(0, 3);
  const featured = resources.filter((item) => item.featured).slice(0, 4);
  const firstLab = labs[0];
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span><BookOpen size={15} /> 面向开发者的入门与实践教程</span><em>免费学习</em></div>
          <h1>系统学习 AI 基础设施，<br /><span>从原理到动手实践。</span></h1>
          <p>从 Linux、GPU 和 PyTorch 基础开始，逐步学习算子优化、分布式训练、推理服务与生产部署。每个实验都提供命令、验证方法和结果模板。</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => navigate('curriculum')}>查看学习路径 <ArrowRight size={17} /></button>
            <button className="btn btn-ghost" onClick={() => openLab(firstLab.id)}>从第一个实验开始 <FlaskConical size={17} /></button>
          </div>
          <div className="hero-footnote"><ListChecks size={16} /><span>建议先具备 Python、Linux 命令行和基础深度学习知识</span></div>
        </div>
        <div className="hero-system learning-route" aria-label="推荐学习顺序">
          <div className="system-top"><span>推荐学习顺序</span><Map size={18} /></div>
          <div className="route-list">
            {learningPaths.slice(0, 4).map((path) => <button className="route-step" key={path.id} onClick={() => openModule(path.moduleIds[0])}>
              <span>{path.phase}</span><div><strong>{path.title}</strong><small>{path.goal}</small></div><ChevronRight size={17} />
            </button>)}
          </div>
          <button className="route-more" onClick={() => navigate('curriculum')}>查看全部六个阶段 <ArrowRight size={15} /></button>
        </div>
      </section>

      <section className="stats-strip" aria-label="网站内容统计">
        <div><strong>{modules.length}</strong><span>知识领域<small>按技术方向分类</small></span></div>
        <div><strong>{ALL_TOPICS.length}</strong><span>核心主题<small>带关键问题与导读</small></span></div>
        <div><strong>{resources.length}</strong><span>精选资料<small>优先官方文档与论文</small></span></div>
        <div><strong>{labs.length}</strong><span>动手实验<small>命令与结果验证齐全</small></span></div>
        <div className="stats-progress"><ProgressRing value={overallProgress} size={58} stroke={5} /><span>我的学习进度<small>已完成 {completedTopics} 个主题</small></span></div>
      </section>

      <div className="dashboard-grid">
        <section className="panel continue-panel">
          <SectionHead eyebrow="继续学习" title="接下来学什么" action={<button className="text-link" onClick={() => navigate('curriculum')}>完整学习路径 <ArrowUpRight size={15} /></button>} />
          <div className="next-list">
            {nextTopics.length ? nextTopics.map((topic, index) => <button key={topic.id} onClick={() => openModule(topic.module.id)}>
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
            return <button className={`module-card tone-${((module.order - 1) % 4) + 1}`} key={module.id} onClick={() => openModule(module.id)}>
              <div className="module-card-top"><span className="module-icon"><ModuleIcon module={module} /></span><em>{String(module.order).padStart(2, '0')}</em></div>
              <small>{module.layer} · {module.level}</small><h3>{module.title}</h3><p>{module.brief}</p>
              <div className="module-card-foot"><span>{module.topics.length} 个主题 · 建议 {module.hours} 小时</span><span className="mini-progress"><i style={{ width: `${done / module.topics.length * 100}%` }} /></span></div>
            </button>;
          })}
        </div>
      </section>

      <div className="home-bottom-grid">
        <section className="home-section">
          <SectionHead eyebrow="精选阅读" title="值得先读的资料" action={<button className="text-link" onClick={() => openResources()}>查看全部 {resources.length} 条 <ArrowUpRight size={15} /></button>} />
          <div className="featured-resources">
            {featured.map((item) => <a key={item.id} href={item.url} target="_blank" rel="noreferrer">
              <span className="resource-type">{item.type}</span><div><h3>{item.title}</h3><p>{item.description}</p><small>{modules.find((module) => module.id === item.category)?.title} · {item.level}</small></div><ArrowUpRight size={18} />
            </a>)}
          </div>
        </section>
        <section className="home-section recent-notes">
          <SectionHead eyebrow="学习工具" title="实验记录与方法模板" action={<button className="text-link" onClick={() => navigate('notes')}>全部笔记 <ArrowUpRight size={15} /></button>} />
          {builtInNotes.slice(1, 4).map((note) => <button key={note.id} onClick={() => openNote(note.id)}>
            <FileText size={19} /><span><strong>{note.title}</strong><small>{note.summary}</small></span><ChevronRight size={17} />
          </button>)}
        </section>
      </div>
    </>
  );
}

function CurriculumPage({ selectedModuleId, setSelectedModuleId, progress, setProgress, setTopicDetail, openResources }) {
  const selected = modules.find((module) => module.id === selectedModuleId) || modules[0];
  const selectedDone = selected.topics.filter((topic) => progress[topic.id]).length;
  return (
    <>
      <PageTitle eyebrow="循序渐进" title="学习路径"
        description="按六个阶段学习，每个阶段都有明确目标和对应实践。点击领域查看主题，完成学习后再做标记。" />
      <section className="path-rail">
        {learningPaths.map((path) => {
          const pathTopics = modules.filter((module) => path.moduleIds.includes(module.id)).flatMap((module) => module.topics);
          const done = pathTopics.filter((topic) => progress[topic.id]).length;
          return <article key={path.id}>
            <div className="path-top"><span>{path.phase}</span><em>{path.duration}</em></div>
            <h3>{path.title}</h3><p>{path.goal}</p>
            <div className="path-modules">{path.moduleIds.map((id) => <button key={id} onClick={() => {
              setSelectedModuleId(id); document.getElementById('module-workbench')?.scrollIntoView({ behavior: 'smooth' });
            }}>{modules.find((module) => module.id === id)?.title}</button>)}</div>
            <div className="path-project"><FlaskConical size={15} /><span>{path.project}</span></div>
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
    </>
  );
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
          <div className="eyebrow">CURRENT LAYER / {layer.en}</div><h2>{layer.name}</h2>
          <p>这一层包含 {layer.moduleIds.length} 个知识领域。先建立组件之间的关系，再深入具体实现。</p>
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
        <SectionHead eyebrow="START WITH A PROBLEM" title="也可以从一个真实问题开始" />
        <div className="problem-grid">{paths.map((path) => {
          const Icon = path.icon;
          return <button key={path.title} onClick={() => { setActiveLayer(path.layerId); document.querySelector('.atlas-layout')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <Icon size={23} /><h3>{path.title}</h3><p>{path.text}</p><span>定位相关层级 <ArrowUpRight size={15} /></span>
          </button>;
        })}</div>
      </section>
      <section className="principles-strip"><div><span>01</span><strong>自顶向下看架构</strong><p>先理解请求与数据如何流动。</p></div><div><span>02</span><strong>自底向上做优化</strong><p>用硬件与系统证据验证假设。</p></div><div><span>03</span><strong>从故障反向学习</strong><p>把每次异常变成一张知识索引。</p></div></section>
    </>
  );
}

function ResourcesPage({ focus, bookmarks, toggleBookmark }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [type, setType] = useState('全部类型');
  const [level, setLevel] = useState('全部难度');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [limit, setLimit] = useState(24);
  useEffect(() => {
    if (!focus?.nonce) return;
    setQuery(focus.query || ''); setCategory(focus.category || 'all'); setLimit(24);
  }, [focus]);
  const filtered = useMemo(() => resources.filter((item) => {
    const haystack = `${item.title} ${item.description} ${item.type} ${modules.find((module) => module.id === item.category)?.title}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (category === 'all' || item.category === category)
      && (type === '全部类型' || item.type === type) && (level === '全部难度' || item.level === level)
      && (!bookmarkedOnly || bookmarks.includes(item.id));
  }), [query, category, type, level, bookmarkedOnly, bookmarks]);
  useEffect(() => { setLimit(24); }, [query, category, type, level, bookmarkedOnly]);
  function reset() { setQuery(''); setCategory('all'); setType('全部类型'); setLevel('全部难度'); setBookmarkedOnly(false); }
  return (
    <>
      <PageTitle eyebrow="学习资源" title="资源库"
        description={`按领域、难度和资料类型查找 ${resources.length} 条精选内容。优先收录官方文档、经典论文、课程与可复现项目。`}
        actions={<button className={`btn ${bookmarkedOnly ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setBookmarkedOnly(!bookmarkedOnly)}><Bookmark size={16} />我的收藏 <span>{bookmarks.length}</span></button>} />
      <section className="library-controls">
        <label className="library-search"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索 vLLM、FSDP、NCCL、量化…" />{query && <button onClick={() => setQuery('')} aria-label="清空搜索"><X size={17} /></button>}</label>
        <div className="filter-row">
          <label><span>知识领域</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">全部领域</option>{modules.map((module) => <option value={module.id} key={module.id}>{module.title}</option>)}</select><ChevronDown size={15} /></label>
          <label><span>难度</span><select value={level} onChange={(event) => setLevel(event.target.value)}><option>全部难度</option><option>入门</option><option>进阶</option><option>深入</option></select><ChevronDown size={15} /></label>
          <button className="reset-filter" onClick={reset}><RotateCcw size={15} />重置筛选</button>
        </div>
        <div className="type-chips">{RESOURCE_TYPES.map((item) => <button key={item} className={type === item ? 'active' : ''} onClick={() => setType(item)}>{item}</button>)}</div>
      </section>
      <div className="library-result-head"><span><strong>{filtered.length}</strong> 条结果{bookmarkedOnly && ' · 仅看收藏'}</span><span>按内容策划顺序排列</span></div>
      {filtered.length ? <div className="resource-grid">{filtered.slice(0, limit).map((item) => {
        const module = modules.find((entry) => entry.id === item.category);
        const saved = bookmarks.includes(item.id);
        return <article className="resource-card" key={item.id}>
          <div className="resource-card-top"><span>{item.type}</span><button className={saved ? 'saved' : ''} onClick={() => toggleBookmark(item.id)} aria-label={saved ? '取消收藏' : '收藏'}>{saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}</button></div>
          <div className="resource-domain"><ModuleIcon module={module} size={16} />{module.title}</div>
          <h2><a href={item.url} target="_blank" rel="noreferrer">{item.title}</a></h2><p>{item.description}</p>
          <div className="resource-card-foot"><span>{item.level} · {item.lang}</span><a href={item.url} target="_blank" rel="noreferrer" aria-label={`打开 ${item.title}`}><ArrowUpRight size={18} /></a></div>
        </article>;
      })}</div> : <EmptyState title="没有找到匹配资料" description="试试更短的关键词，或清除领域与难度筛选。" action={<button className="btn btn-primary" onClick={reset}>清除筛选</button>} />}
      {limit < filtered.length && <button className="load-more" onClick={() => setLimit((value) => value + 24)}>再显示 {Math.min(24, filtered.length - limit)} 条<ChevronDown size={17} /></button>}
      <div className="library-note"><ShieldCheck size={17} /><p>链接会在新标签页打开，资料版本与正文以原站点为准。收藏只保存在当前浏览器，可以在“设置与备份”中导出。</p></div>
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
        description="选择与你的环境匹配的实验，按顺序复制命令、检查结果并保存数据。步骤勾选只用于记录进度，完成与否以实际结果为准。" />
      <div className="lab-workspace">
        <section className="lab-manual">
          <div className="lab-manual-head"><div><span>实验 {lab.number} · {lab.level}</span><h2>{lab.title}</h2><p>{lab.subtitle}</p></div><ProgressRing value={percentage} size={82} /></div>
          <div className="lab-info-row"><span><Clock3 size={16} />{lab.duration}</span><span><SquareTerminal size={16} />{lab.environment}</span><button onClick={() => openModule(lab.moduleId)}>先学相关知识 <ArrowUpRight size={15} /></button></div>
          <div className="lab-goal"><span>完成这个实验，你会得到</span><p>{lab.goal}</p></div>

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
                  {detail.expected && <div className="step-expected"><CheckCircle2 size={18} /><div><strong>如何确认这一步做对了</strong><p>{detail.expected}</p></div></div>}
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
  const visible = notes.filter((note) => (filter === 'all' || (filter === 'mine' ? note.source === 'personal' : note.source === 'builtin'))
    && (!query || `${note.title} ${note.summary} ${note.body}`.toLowerCase().includes(query.toLowerCase())));
  const selected = notes.find((note) => note.id === selectedNoteId) || visible[0] || notes[0];
  useEffect(() => { if (selected && !visible.some((note) => note.id === selected.id) && visible[0]) setSelectedNoteId(visible[0].id); }, [filter, query]);
  function startNew(template) {
    setEditing(template?.source === 'personal' ? template : null);
    setDraft(template ? { title: template.source === 'personal' ? template.title : `${template.title} · 我的版本`, tags: (template.tags || []).join(', '), body: template.body } : { title: '', tags: '', body: '# 标题\n\n## 背景\n\n## 过程与数据\n\n## 结论与未知项\n' });
  }
  function startEdit(note) { setEditing(note); setDraft({ title: note.title, tags: (note.tags || []).join(', '), body: note.body }); }
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
    setEditing(null); setDraft({ title: '', tags: '', body: '' }); showToast('笔记已保存到当前浏览器');
  }
  function deleteNote(note) {
    if (!window.confirm(`确定删除「${note.title}」吗？此操作只影响本机浏览器中的笔记。`)) return;
    setPersonalNotes((items) => items.filter((item) => item.id !== note.id));
    setSelectedNoteId(builtInNotes[0]?.id); showToast('笔记已删除');
  }
  const editorOpen = editing !== null || draft.title || draft.body;
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
          {selected && <><div className="note-reader-toolbar"><div><span className="note-kind">{selected.kind}</span><time>{selected.date}{selected.updatedAt && selected.source === 'personal' ? ' · 已编辑' : ''}</time></div><div>
            <button onClick={() => downloadFile(`${selected.title}.md`, noteToMarkdown(selected), 'text/markdown;charset=utf-8')} title="导出 Markdown"><Download size={17} /></button>
            {selected.source === 'personal' ? <><button onClick={() => startEdit(selected)} title="编辑"><Edit3 size={17} /></button><button className="danger" onClick={() => deleteNote(selected)} title="删除"><Trash2 size={17} /></button></> : <button onClick={() => startNew(selected)} title="以此为模板"><Copy size={17} /></button>}
          </div></div><article className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{selected.body}</ReactMarkdown></article>
            <footer className="note-reader-footer"><span>{selected.source === 'personal' ? '我的个人笔记' : 'Infra Atlas 内置内容'}</span>{selected.source === 'builtin' && <button onClick={() => startNew(selected)}>以此为模板写笔记 <ArrowRight size={15} /></button>}</footer></>}
        </section>
      </div>
      {editorOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) { setEditing(null); setDraft({ title: '', tags: '', body: '' }); } }}>
        <section className="note-editor modal-card"><div className="modal-head"><div><span>MARKDOWN EDITOR</span><h2>{editing ? '编辑我的笔记' : '写一篇新笔记'}</h2></div><button className="icon-btn" onClick={() => { setEditing(null); setDraft({ title: '', tags: '', body: '' }); }}><X size={20} /></button></div>
          <div className="editor-fields"><input className="editor-title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="笔记标题" autoFocus /><input value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} placeholder="标签，用逗号分隔（如：推理, 排障）" /><textarea value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} placeholder="支持 Markdown：标题、列表、表格、代码块…" /></div>
          <div className="editor-foot"><span>Markdown · 保存到当前浏览器</span><div><button className="btn btn-ghost" onClick={() => { setEditing(null); setDraft({ title: '', tags: '', body: '' }); }}>取消</button><button className="btn btn-primary" onClick={saveNote}><Save size={16} />保存笔记</button></div></div>
        </section>
      </div>}
    </>
  );
}

function MaintenancePage({ progress, setProgress, bookmarks, setBookmarks, personalNotes, setPersonalNotes, labProgress, setLabProgress, theme, setTheme, showToast, completedTopics }) {
  const fileInput = useRef(null);
  const completedLabSteps = Object.values(labProgress).reduce((total, steps) => total + steps.length, 0);
  function exportBackup() {
    const payload = { product: 'Infra Atlas', version: 1, exportedAt: new Date().toISOString(), data: { progress, bookmarks, personalNotes, labProgress, theme } };
    downloadFile(`infra-atlas-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2), 'application/json');
    showToast('学习数据备份已导出');
  }
  async function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      if (payload.product !== 'Infra Atlas' || !payload.data) throw new Error('invalid');
      if (!window.confirm('导入会替换当前浏览器中的进度、收藏、个人笔记和实验记录。建议先导出备份。继续吗？')) return;
      const data = payload.data;
      setProgress(data.progress || {}); setBookmarks(data.bookmarks || []); setPersonalNotes(data.personalNotes || []);
      setLabProgress(data.labProgress || {}); if (['light', 'dark'].includes(data.theme)) setTheme(data.theme);
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
            <article><span>02</span><div><h3>边做实验边保存结果</h3><p>在“动手实验”中复制命令并逐步核对结果。每个实验都可以下载 Markdown 记录模板，用来保存环境、参数、数据和问题。</p></div></article>
            <article><span>03</span><div><h3>把笔记和进度一起带走</h3><p>笔记、收藏、主题进度和实验勾选都保存在当前浏览器。换设备时，先在这里导出备份，再在新设备上恢复。</p></div></article></div>
        </section>
        <aside className="panel backup-panel"><SectionHead eyebrow="学习数据" title="备份与恢复" /><div className="backup-icon"><HardDrive size={34} /></div><p>备份包含主题进度、资源收藏、实验勾选、个人笔记和显示设置。恢复备份会替换当前浏览器里的对应记录。</p>
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
  const related = resources.filter((item) => item.category === module.id).slice(0, 4);
  const done = !!progress[topic.id];
  return <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <aside className="topic-drawer"><div className="drawer-top"><span>{module.en} / TOPIC</span><button className="icon-btn" onClick={onClose}><X size={20} /></button></div>
      <div className="drawer-module"><ModuleIcon module={module} size={22} />{module.title}</div><h2>{topic.title}</h2><p className="drawer-summary">{topic.summary}</p>
      <div className="key-question"><span>KEY QUESTION</span><h3>{topic.question}</h3><p>先写下自己的答案，再阅读资料或设计实验。能解释边界与例外，比记住定义更重要。</p></div>
      <div className="drawer-outcomes"><h3>完成这个领域后，你应该能够</h3>{module.outcomes.map((outcome) => <div key={outcome}><Check size={15} /><span>{outcome}</span></div>)}</div>
      <div className="drawer-resources"><div><h3>相关入口</h3><button onClick={() => { onClose(); openResources(module.id); }}>查看全部 <ArrowRight size={14} /></button></div>{related.map((item) => <a href={item.url} target="_blank" rel="noreferrer" key={item.id}><span>{item.type}</span><strong>{item.title}</strong><ArrowUpRight size={16} /></a>)}</div>
      <button className={`btn ${done ? 'btn-ghost' : 'btn-primary'} drawer-done`} onClick={() => setProgress((state) => ({ ...state, [topic.id]: !state[topic.id] }))}>{done ? <><RotateCcw size={17} />取消完成标记</> : <><CheckCircle2 size={17} />标记这个主题已学习</>}</button>
      <p className="drawer-footnote">完成标记仅用于记录你的学习轨迹，不代表能力认证。</p>
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
      ...ALL_TOPICS.filter((topic) => score(`${topic.title} ${topic.summary} ${topic.module.title}`)).map((topic) => ({ id: topic.id, kind: '知识主题', title: topic.title, subtitle: `${topic.module.title} · ${topic.summary}`, action: () => openTopic(topic.module, topic) })),
      ...resources.filter((item) => score(`${item.title} ${item.description} ${item.type}`)).map((item) => ({ id: item.id, kind: '资源', title: item.title, subtitle: item.description, action: () => openResources(item.title) })),
      ...labs.filter((lab) => score(`${lab.title} ${lab.subtitle} ${lab.goal}`)).map((lab) => ({ id: lab.id, kind: '实验', title: lab.title, subtitle: `${lab.level} · ${lab.subtitle}`, action: () => openLab(lab.id) })),
      ...notes.filter((note) => score(`${note.title} ${note.summary} ${note.body}`)).map((note) => ({ id: note.id, kind: '笔记', title: note.title, subtitle: note.summary, action: () => openNote(note.id) })),
    ].slice(0, 12);
  }, [query, notes]);
  const suggestions = ['分布式训练', 'KV Cache', 'Triton', 'GPU 调度'];
  return <div className="modal-backdrop search-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="search-palette">
    <label><Search size={22} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索全站知识、资源、实验与笔记…" /><kbd>ESC</kbd></label>
    {!query && <div className="search-start"><span>试试这些关键词</span><div>{suggestions.map((item) => <button key={item} onClick={() => setQuery(item)}>{item}</button>)}</div><p><Command size={13} /> K 随时唤起搜索 · 支持中文与英文项目名</p></div>}
    {query && <div className="search-results">{results.map((result) => <button key={`${result.kind}-${result.id}`} onClick={result.action}><span>{result.kind}</span><div><strong>{result.title}</strong><p>{result.subtitle}</p></div><ArrowRight size={17} /></button>)}{!results.length && <EmptyState title="没有找到相关内容" description="换一个关键词，或到资源库中按领域浏览。" />}</div>}
    {query && results.length > 0 && <div className="search-count">显示前 {results.length} 条结果</div>}
  </section></div>;
}

export default App;
