export function videosHref(videoId, resourceId, section) {
  const path = `#/videos${videoId ? `/${encodeURIComponent(videoId)}` : ''}${resourceId ? `/resources/${encodeURIComponent(resourceId)}` : ''}`;
  return path + (section ? `?${new URLSearchParams({ section })}` : '');
}

export function parseVideoRoute(hash) {
  const [path, query = ''] = hash.replace(/^#\/?/, '').split('?');
  const parts = path.split('/');
  if (parts[0] !== 'videos') return null;
  try {
    if (parts.length !== 1 && parts.length !== 2 && !(parts.length === 4 && parts[2] === 'resources')) return { invalid: true };
    if (parts.some(part => !part)) return { invalid: true };
    return { videoId: parts[1] ? decodeURIComponent(parts[1]) : null, resourceId: parts[3] ? decodeURIComponent(parts[3]) : null, section: new URLSearchParams(query).get('section') || '' };
  } catch { return { invalid: true }; }
}

export function publicFileHref(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
