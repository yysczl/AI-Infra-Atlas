import { ArrowRight, Clapperboard } from 'lucide-react';
import { videos } from '../../content/videos.js';
import { publicFileHref, videosHref } from './routes.js';

export default function VideoList() {
  return <>
    <header className="page-title-row"><div><div className="eyebrow">视频配套资料</div><h1>科普视频</h1><p>找到每期视频的互动课件与补充阅读，按自己的节奏继续探索。</p></div></header>
    <div className="video-grid">{videos.map(video => <a className="video-card" href={videosHref(video.id)} key={video.id}>
      {video.cover ? <img className="video-cover" src={publicFileHref(video.cover)} alt="" loading="lazy" /> : <div className="video-card-art"><Clapperboard size={38} /><span>AI INFRA / 科普视频</span></div>}
      <div className="video-card-body"><div className="video-tags">{video.slides && <span>互动课件</span>}{video.resources.length > 0 && <span>{video.resources.length} 篇补充阅读</span>}</div><h2>{video.title}</h2><p>{video.description}</p><span className="video-card-open">查看资料 <ArrowRight size={17} /></span></div>
    </a>)}</div>
    {!videos.length && <p>还没有发布视频资料。</p>}
  </>;
}
