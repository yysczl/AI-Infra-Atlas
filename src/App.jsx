import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, ArrowRight, ArrowUpRight, BarChart3, Bookmark, BookmarkCheck,
  BookOpen, Boxes, Braces, Cable, Check, CheckCircle2, ChevronDown,
  ChevronRight, Circle, CircleGauge, Clock3, Command, Copy, Cpu, Database,
  Download, Edit3, ExternalLink, FileText, FlaskConical, GitBranch, HardDrive,
  Layers3, LayoutDashboard, LibraryBig, Map, Menu, Moon, Network, NotebookPen,
  Plus, RotateCcw, Save, ScanSearch, Search, Server, Settings2, ShieldCheck,
  Sparkles, SquareTerminal, Sun, Trash2, Upload, Workflow, X, Zap,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { learningPaths, modules, stackLayers } from './content/curriculum.js';
import resources from './content/resources.json';
import { labs } from './content/labs.js';
import { builtInNotes } from './content/notes.js';

const PAGE_IDS = ['dashboard', 'curriculum', 'map', 'resources', 'labs', 'notes', 'maintenance'];
const PAGE_META = {
  dashboard: { label: '学习总览', eyebrow: 'WORKSPACE' },
  curriculum: { label: '学习路径', eyebrow: 'LEARNING PATH' },
  map: { label: '知识地图', eyebrow: 'KNOWLEDGE ATLAS' },
  resources: { label: '资源库', eyebrow: 'CURATED LIBRARY' },
  labs: { label: '实战实验室', eyebrow: 'HANDS-ON LABS' },
  notes: { label: '个人笔记', eyebrow: 'YOUR KNOWLEDGE' },
  maintenance: { label: '更新与备份', eyebrow: 'CONTENT STUDIO' },
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
    labProgress={labProgress} setLabProgress={setLabProgress} openModule={openModule} />;
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
        <button className="brand" onClick={() => navigate('dashboard')} aria-label="返回学习总览">
          <span className="brand-mark"><span>IA</span><i /></span>
          <span><strong>Infra Atlas</strong><small>AI 基建学习站</small></span>
        </button>
        <div className="sidebar-label">我的学习空间</div>
        <nav className="main-nav">
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
          <div className="sidebar-progress-head"><span>知识探索进度</span><strong>{overallProgress}%</strong></div>
          <div className="linear-track"><i style={{ width: `${overallProgress}%` }} /></div>
          <p>{completedTopics} / {ALL_TOPICS.length} 个主题已标记</p>
          <button onClick={() => navigate('curriculum')}>继续学习 <ArrowRight size={14} /></button>
        </div>
        <div className="sidebar-foot"><span className="status-dot" />本地优先 · 数据仅存于此浏览器</div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn mobile-menu" onClick={() => setMobileNav(true)} aria-label="打开导航"><Menu size={21} /></button>
            <span className="breadcrumb">ATLAS <ChevronRight size={13} /> {PAGE_META[activePage].eyebrow}</span>
          </div>
          <div className="topbar-actions">
            <button className="search-trigger" onClick={() => setSearchOpen(true)}><Search size={17} /><span>搜索知识、资源、实验…</span><kbd><Command size={11} /> K</kbd></button>
            <button className="icon-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="切换明暗主题">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button className="avatar" onClick={() => navigate('notes')} title="进入我的笔记">S</button>
          </div>
        </header>
        <main className={`page page-${activePage}`}>{content}</main>
        <footer className="site-footer">
          <span>INFRA ATLAS · BUILT TO KEEP LEARNING</span>
          <span>内容驱动 / 本地优先 / 持续更新</span>
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
  const firstLab = labs.find((lab) => lab.id === 'lab-serving');
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span><Sparkles size={14} /> PERSONAL KNOWLEDGE SYSTEM</span><em>持续生长</em></div>
          <h1>把 AI 基建，<br />学成一张<span>能走的地图。</span></h1>
          <p>从一颗 GPU 到生产级大模型系统。用清晰路径建立体系，用真实实验验证理解，再把你的经验写回这里。</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => navigate('curriculum')}>从学习路径开始 <ArrowRight size={17} /></button>
            <button className="btn btn-ghost" onClick={() => navigate('map')}>浏览全栈地图 <Map size={17} /></button>
          </div>
          <div className="hero-footnote"><span>NO. 001</span><i />为长期学习而设计，不为一次性收藏。</div>
        </div>
        <div className="hero-system" aria-label="AI Infra 技术栈示意图">
          <div className="system-top"><span>THE AI INFRA STACK</span><CircleGauge size={18} /></div>
          <div className="system-diagram">
            {stackLayers.map((layer, index) => <div className="system-layer" key={layer.id} style={{ '--i': index }}>
              <span>0{stackLayers.length - index}</span><strong>{layer.en}</strong><i /><em>{layer.name}</em>
            </div>)}
          </div>
          <div className="system-bottom"><span><i /> CONTENT-DRIVEN</span><span>LOCAL-FIRST</span></div>
        </div>
      </section>

      <section className="stats-strip">
        <div><strong>{modules.length}</strong><span>知识领域<small>DOMAINS</small></span></div>
        <div><strong>{ALL_TOPICS.length}</strong><span>核心主题<small>CORE TOPICS</small></span></div>
        <div><strong>{resources.length}</strong><span>精选资料<small>RESOURCES</small></span></div>
        <div><strong>{labs.length}</strong><span>实战实验<small>LABS</small></span></div>
        <div className="stats-progress"><ProgressRing value={overallProgress} size={58} stroke={5} /><span>我的探索进度<small>{completedTopics} 个主题已标记</small></span></div>
      </section>

      <div className="dashboard-grid">
        <section className="panel continue-panel">
          <SectionHead eyebrow="UP NEXT" title="接着往前，走一小步" action={<button className="text-link" onClick={() => navigate('curriculum')}>完整路径 <ArrowUpRight size={15} /></button>} />
          <div className="next-list">
            {nextTopics.length ? nextTopics.map((topic, index) => <button key={topic.id} onClick={() => openModule(topic.module.id)}>
              <span className="next-index">0{index + 1}</span>
              <span><small>{topic.module.title} · {topic.module.en}</small><strong>{topic.title}</strong><em>{topic.summary}</em></span>
              <ArrowUpRight size={18} />
            </button>) : <EmptyState icon={CheckCircle2} title="全部主题已标记" description="可以回到笔记，整理自己的知识体系。" />}
          </div>
        </section>
        <section className="panel lab-callout">
          <div className="lab-callout-top"><span>RECOMMENDED LAB</span><FlaskConical size={22} /></div>
          <div className="lab-number">{firstLab.number}</div>
          <h3>{firstLab.title}</h3><p>{firstLab.subtitle}</p>
          <div className="lab-meta"><span><Clock3 size={14} />{firstLab.duration}</span><span>{firstLab.level}</span></div>
          <button onClick={() => openLab(firstLab.id)}>打开实验手册 <ArrowRight size={16} /></button>
        </section>
      </div>

      <section className="home-section">
        <SectionHead eyebrow="THE BIG PICTURE" title="十四个领域，一幅完整地图" action={<button className="text-link" onClick={() => navigate('map')}>按技术栈查看 <ArrowUpRight size={15} /></button>} />
        <div className="module-grid">
          {modules.map((module) => {
            const done = module.topics.filter((topic) => progress[topic.id]).length;
            return <button className={`module-card tone-${((module.order - 1) % 4) + 1}`} key={module.id} onClick={() => openModule(module.id)}>
              <div className="module-card-top"><span className="module-icon"><ModuleIcon module={module} /></span><em>{String(module.order).padStart(2, '0')}</em></div>
              <small>{module.en}</small><h3>{module.title}</h3><p>{module.brief}</p>
              <div className="module-card-foot"><span>{module.topics.length} 个主题 · {module.hours}h</span><span className="mini-progress"><i style={{ width: `${done / module.topics.length * 100}%` }} /></span></div>
            </button>;
          })}
        </div>
      </section>

      <div className="home-bottom-grid">
        <section className="home-section">
          <SectionHead eyebrow="EDITOR'S SELECTION" title="值得先读的资料" action={<button className="text-link" onClick={() => openResources()}>全部 {resources.length} 条 <ArrowUpRight size={15} /></button>} />
          <div className="featured-resources">
            {featured.map((item) => <a key={item.id} href={item.url} target="_blank" rel="noreferrer">
              <span className="resource-type">{item.type}</span><div><h3>{item.title}</h3><p>{item.description}</p><small>{modules.find((module) => module.id === item.category)?.title} · {item.level}</small></div><ArrowUpRight size={18} />
            </a>)}
          </div>
        </section>
        <section className="home-section recent-notes">
          <SectionHead eyebrow="FROM THE NOTEBOOK" title="方法与模板" action={<button className="text-link" onClick={() => navigate('notes')}>全部笔记 <ArrowUpRight size={15} /></button>} />
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
      <PageTitle eyebrow="LEARNING PATH" title="不是收藏清单，是你的学习路径"
        description="六个阶段建立完整视野；每个主题都用一个关键问题驱动学习。标记只保存在当前浏览器。" />
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
      <PageTitle eyebrow="KNOWLEDGE ATLAS" title="从应用到底层，看懂每一层"
        description="点击技术栈切换层级，再进入具体领域。遇到问题时，也可以从下方的问题入口反向定位。" />
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
      <PageTitle eyebrow="CURATED LIBRARY" title="资料很多，只保留值得读的"
        description={`首批 ${resources.length} 条资料，优先官方文档、经典论文、课程与可复现项目。链接指向各自原始来源。`}
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
      <div className="library-note"><ShieldCheck size={17} /><p>资源版本与内容以原站点为准。本站不自动抓取正文；你可以在“更新与备份”中找到新增资源和链接体检流程。</p></div>
    </>
  );
}

function LabsPage({ selectedLabId, setSelectedLabId, labProgress, setLabProgress, openModule }) {
  const lab = labs.find((item) => item.id === selectedLabId) || labs[0];
  const completed = labProgress[lab.id] || [];
  const percentage = Math.round(completed.length / lab.steps.length * 100);
  function toggleStep(index) {
    setLabProgress((state) => {
      const current = state[lab.id] || [];
      return { ...state, [lab.id]: current.includes(index) ? current.filter((item) => item !== index) : [...current, index] };
    });
  }
  return (
    <>
      <PageTitle eyebrow="HANDS-ON LABS" title="把理解变成一次可复现的实验"
        description="每个实验都有明确环境、步骤、指标与交付物。先写假设，再保存原始数据，最后记录不能解释的部分。" />
      <div className="lab-workspace">
        <section className="lab-manual">
          <div className="lab-manual-head"><div><span>LAB {lab.number} / {lab.level}</span><h2>{lab.title}</h2><p>{lab.subtitle}</p></div><ProgressRing value={percentage} size={82} /></div>
          <div className="lab-info-row"><span><Clock3 size={16} />{lab.duration}</span><span><SquareTerminal size={16} />{lab.environment}</span><button onClick={() => openModule(lab.moduleId)}>关联领域 <ArrowUpRight size={15} /></button></div>
          <div className="lab-goal"><span>实验目标</span><p>{lab.goal}</p></div>
          <div className="lab-steps"><h3>实验步骤 <small>{completed.length} / {lab.steps.length} 已完成</small></h3>
            {lab.steps.map((step, index) => <button key={step.title} className={completed.includes(index) ? 'done' : ''} onClick={() => toggleStep(index)}>
              <span className="step-check">{completed.includes(index) ? <Check size={17} /> : index + 1}</span><span><strong>{step.title}</strong><p>{step.detail}</p></span>
            </button>)}
          </div>
          <div className="lab-output"><div><BarChart3 size={20} /><h3>至少记录这些指标</h3></div><ul>{lab.metrics.map((metric) => <li key={metric}>{metric}</li>)}</ul></div>
          <div className="deliverable"><FileText size={22} /><div><span>DEFINITION OF DONE</span><h3>本次交付物</h3><p>{lab.deliverable}</p></div></div>
          <div className="lab-resources"><h3>实验前可参考</h3><div>{lab.resourceIds.map((id) => {
            const resource = resources.find((item) => item.id === id);
            return resource ? <a href={resource.url} target="_blank" rel="noreferrer" key={id}>{resource.title}<ArrowUpRight size={14} /></a> : null;
          })}</div></div>
        </section>
        <aside className="lab-catalog"><div className="lab-catalog-title">实验目录 <span>{labs.length}</span></div>{labs.map((item) => {
          const done = (labProgress[item.id] || []).length;
          return <button key={item.id} className={item.id === lab.id ? 'active' : ''} onClick={() => setSelectedLabId(item.id)}><span>{item.number}</span><div><strong>{item.title}</strong><small>{item.level} · {item.duration}</small><i><em style={{ width: `${done / item.steps.length * 100}%` }} /></i></div><ChevronRight size={16} /></button>;
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
      <PageTitle eyebrow="YOUR KNOWLEDGE" title="把经验写下来，知识才真正属于你"
        description="站内指南与个人笔记统一管理。你的新增内容只保存在当前浏览器，可导出 Markdown 或整站备份。"
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
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); showToast('命令已复制'); } catch { showToast('复制失败，请手动选择命令'); }
  }
  const commands = [
    { title: '新增一篇 Markdown 笔记', code: 'npm run new:note -- "我的 AI Infra 学习笔记"' },
    { title: '校验内容并构建网站', code: 'npm run check && npm run build' },
    { title: '检查资源链接是否仍可访问', code: 'npm run check:links' },
  ];
  return (
    <>
      <PageTitle eyebrow="CONTENT STUDIO" title="这不是成品站，而是一套可持续生长的系统"
        description="内容、学习数据与界面分离。以后新增工作经验时，可以直接写 Markdown；资源和课程则由结构化文件统一维护。" />
      <section className="content-stats"><div><Database size={21} /><strong>{resources.length}</strong><span>结构化资源</span></div><div><BookOpen size={21} /><strong>{ALL_TOPICS.length}</strong><span>课程主题</span></div><div><NotebookPen size={21} /><strong>{personalNotes.length}</strong><span>我的笔记</span></div><div><CheckCircle2 size={21} /><strong>{completedTopics}</strong><span>已标记主题</span></div></section>
      <div className="maintenance-grid">
        <section className="panel content-guide"><SectionHead eyebrow="UPDATE WORKFLOW" title="三种方式，持续添砖加瓦" />
          <div className="update-methods"><article><span>01</span><div><h3>写工作经验与学习笔记</h3><p>在上方直接新建笔记，或把 Markdown 文件放进 <code>src/content/notes/</code>。重新构建后会自动进入网站。</p></div></article>
            <article><span>02</span><div><h3>补充资源与知识体系</h3><p>资源维护在 <code>src/content/resources.json</code>；领域与学习路径维护在 <code>src/content/curriculum.js</code>。构建时会检查必填字段和重复 ID。</p></div></article>
            <article><span>03</span><div><h3>把浏览器数据带走</h3><p>进度、收藏、实验勾选和私人笔记保存在 localStorage。换浏览器或清理数据前，请先导出完整备份。</p></div></article></div>
          <div className="command-list">{commands.map((command) => <div key={command.code}><span>{command.title}</span><code>{command.code}</code><button onClick={() => copyText(command.code)} aria-label="复制命令"><Copy size={16} /></button></div>)}</div>
        </section>
        <aside className="panel backup-panel"><SectionHead eyebrow="LOCAL DATA" title="备份与恢复" /><div className="backup-icon"><HardDrive size={34} /></div><p>备份包含学习进度、资源收藏、实验勾选、个人笔记和主题设置，不包含网站源文件。</p>
          <button className="btn btn-primary" onClick={exportBackup}><Download size={17} />导出完整学习数据</button><button className="btn btn-ghost" onClick={() => fileInput.current?.click()}><Upload size={17} />从备份恢复</button>
          <input ref={fileInput} type="file" accept="application/json,.json" onChange={importBackup} hidden /><small>JSON 格式 · 仅在本机处理，不上传任何服务器</small>
        </aside>
      </div>
      <section className="project-structure"><div><div className="eyebrow">PROJECT ANATOMY</div><h2>内容结构一眼可见</h2><p>保留源文件夹，就能继续迭代。日常本地预览使用 <code>npm run dev</code>；需要发布静态文件时使用 <code>npm run build</code>。</p></div>
        <pre>{`AI-Infra-Atlas/
├── src/content/
│   ├── curriculum.js     # 领域、主题、学习路径
│   ├── resources.json    # 资源库
│   ├── labs.js           # 实验手册
│   └── notes/            # Markdown 笔记（自动加载）
├── scripts/
│   ├── new-note.mjs      # 新建笔记模板
│   ├── validate-content.mjs
│   └── check-links.mjs   # 资源链接体检
└── package.json          # 本地预览与构建命令`}</pre>
      </section>
      <section className="maintenance-bottom"><div><SectionHead eyebrow="CHANGELOG" title="内容更新记录" /><article className="changelog-item"><span>v1.0</span><div><time>2026-10-26</time><h3>首个完整学习版本</h3><p>建立 {modules.length} 个领域、{ALL_TOPICS.length} 个主题、{resources.length} 条资源、{labs.length} 个实验与 {builtInNotes.length} 篇指南／模板；上线本地进度、收藏、笔记与备份。</p></div></article></div>
        <div className="update-boundary"><ShieldCheck size={23} /><h3>关于“持续更新”</h3><p>网站本身不会在后台自动抓取或改写内容。你添加文件、保存笔记并重新构建后，内容就会更新；外部资料的正文和版本由原站点维护。</p><p>建议每季度运行一次链接体检，并给新资源写清楚推荐理由。</p></div></section>
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
