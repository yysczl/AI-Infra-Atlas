import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ArrowLeft, Download } from 'lucide-react';
import { publicFileHref, videosHref } from './routes.js';

function documentHeadings(body) {
  let fence = null;
  const counts = new Map();
  return body.split('\n').flatMap((line, index) => {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      return [];
    }
    const match = !fence && line.match(/^ {0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!match) return [];
    const title = match[2].replace(/[`*_]/g, '');
    const slug = title.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-') || 'section';
    const count = counts.get(slug) || 0;
    counts.set(slug, count + 1);
    return [{ line: index + 1, title, level: match[1].length, id: count ? `${slug}-${count}` : slug }];
  });
}

export default function ResourceReader({ video, resource, section }) {
  const [document, setDocument] = useState({ body: '', status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const fileHref = publicFileHref(resource.path);
  useEffect(() => {
    const controller = new AbortController();
    setDocument({ body: '', status: 'loading' });
    fetch(fileHref, { signal: controller.signal }).then(async response => {
      if (!response.ok || response.headers.get('content-type')?.includes('text/html')) throw new Error('missing');
      const body = await response.text();
      if (!body.trim()) throw new Error('empty');
      if (!controller.signal.aborted) setDocument({ body, status: 'ready' });
    }).catch(error => { if (error.name !== 'AbortError') setDocument({ body: '', status: 'error' }); });
    return () => controller.abort();
  }, [fileHref, attempt]);
  const headings = useMemo(() => documentHeadings(document.body), [document.body]);
  useEffect(() => {
    if (document.status !== 'ready' || !section) return;
    const target = window.document.getElementById(`video-section-${section}`);
    target?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [section, document.status]);
  const components = Object.fromEntries([1, 2, 3, 4, 5, 6].map(level => [`h${level}`, ({ node, children, ...props }) => {
    const Tag = `h${level}`;
    const heading = headings.find(item => item.line === node.position?.start.line);
    return <Tag {...props} id={heading ? `video-section-${heading.id}` : undefined}>{children}</Tag>;
  }]));
  components.a = ({ node, href, children, ...props }) => <a {...props} href={href} {...(/^https?:\/\//.test(href || '') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>;
  function resolveUrl(value) {
    if (!value) return '';
    if (value.startsWith('#')) {
      try { return videosHref(video.id, resource.id, decodeURIComponent(value.slice(1))); } catch { return ''; }
    }
    const safe = defaultUrlTransform(value);
    if (!safe) return '';
    return new URL(safe, new URL(fileHref, window.location.href)).href;
  }
  return <>
    <div className="video-reader-toolbar"><a href={videosHref(video.id)}><ArrowLeft size={15} />返回本期资料</a><a href={fileHref} download><Download size={15} />下载 Markdown</a></div>
    {document.status === 'loading' && <p role="status">正在加载补充资料…</p>}
    {document.status === 'error' && <div role="alert"><h1>资料加载失败</h1><p>请检查网络后重试，或直接下载文档。</p><button className="btn btn-primary" onClick={() => setAttempt(value => value + 1)}>重新加载</button></div>}
    {document.status === 'ready' && <div className="video-reader-layout">
      <aside className="video-toc" aria-label="文章目录"><strong>本文目录</strong><nav>{headings.filter(item => item.level === 2 || item.level === 3).map(item => <a key={item.id} className={item.level === 3 ? 'is-subheading' : ''} href={videosHref(video.id, resource.id, item.id)} aria-current={section === item.id ? 'location' : undefined}>{item.title}</a>)}</nav></aside>
      <article className="markdown-body video-markdown" aria-label={resource.title}><ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={components} urlTransform={resolveUrl}>{document.body}</ReactMarkdown></article>
    </div>}
  </>;
}
