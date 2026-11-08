import { ArrowUpRight, BookOpen, Download, FileText } from 'lucide-react';
import { publicFileHref, videosHref } from './routes.js';

export default function VideoDetail({ video }) {
  return <>
    <header className="video-intro"><div className="eyebrow">本期资料</div><h1>{video.title}</h1><p>{video.description}</p>{video.audience && <p className="video-audience">{video.audience}</p>}<div className="video-actions">
      {video.videoLinks.map(link => <a key={link.url} className="btn btn-primary" href={link.url} target="_blank" rel="noopener noreferrer">去{link.label}观看 <ArrowUpRight size={16} /></a>)}
      {video.slides && <a className="btn btn-primary" href={publicFileHref(video.slides)} target="_blank" rel="noopener noreferrer"><BookOpen size={17} />打开互动课件 <ArrowUpRight size={16} /></a>}
    </div></header>
    <div className="section-head"><div><h2>补充资料</h2></div></div>
    <div className="video-resources">{video.resources.map(resource => <article className="video-resource" key={resource.id}><FileText size={23} /><div><h3><a href={videosHref(video.id, resource.id)}>{resource.title}</a></h3>{resource.description && <p>{resource.description}</p>}<div className="video-resource-actions"><a href={videosHref(video.id, resource.id)}>在线阅读 <ArrowUpRight size={14} /></a><a href={publicFileHref(resource.path)} download><Download size={14} />下载 Markdown</a></div></div></article>)}</div>
    {!video.resources.length && <p>本期暂无补充文档。</p>}
  </>;
}
