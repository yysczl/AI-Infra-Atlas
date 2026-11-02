export function topicsHref(topicId, lessonId, section) {
  if (!topicId) return '#/topics';
  const params = new URLSearchParams();
  if (section) params.set('section', section);
  const path = `#/topics/${encodeURIComponent(topicId)}${lessonId ? `/${encodeURIComponent(lessonId)}` : ''}`;
  return path + (params.size ? `?${params}` : '');
}

export function parseTopicRoute(hash) {
  const [path, query = ''] = hash.replace(/^#\/?/, '').split('?');
  const [page, first, second] = path.split('/');
  const section = new URLSearchParams(query).get('section') || '';
  if (page === 'topics') return { topicId: first || null, lessonId: second || null, section };
  if (page === 'inference') return { topicId: 'inference', lessonId: first || null, section };
  return null;
}
