import { useEffect } from 'react';
import { videos } from '../../content/videos.js';
import VideoList from './VideoList.jsx';
import VideoDetail from './VideoDetail.jsx';
import ResourceReader from './ResourceReader.jsx';
import { videosHref } from './routes.js';
import './styles.css';

export default function VideoArea({ route }) {
  useEffect(() => { if (!route?.section) window.scrollTo({ top: 0, behavior: 'instant' }); }, [route?.videoId, route?.resourceId]);
  const video = videos.find(item => item.id === route?.videoId);
  const resource = video?.resources.find(item => item.id === route?.resourceId);
  if (!route || route.invalid || (route.videoId && !video) || (route.resourceId && !resource)) return <section className="videos-area"><h1>没有找到这份资料</h1><p>请返回栏目查看已发布的内容。</p><a className="btn btn-primary" href={videosHref()}>返回科普视频</a></section>;
  return <section className="videos-area">
    {video && <nav className="video-breadcrumb" aria-label="视频资料导航"><a href={videosHref()}>科普视频</a><span>/</span>{resource ? <><a href={videosHref(video.id)}>{video.title}</a><span>/</span><span aria-current="page">补充阅读</span></> : <span aria-current="page">{video.title}</span>}</nav>}
    {!video ? <VideoList /> : resource ? <ResourceReader key={`${video.id}/${resource.id}`} video={video} resource={resource} section={route.section} /> : <VideoDetail video={video} />}
  </section>;
}
