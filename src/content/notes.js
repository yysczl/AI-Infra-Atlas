const noteFiles = import.meta.glob('./notes/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function parseValue(value) {
  const clean = value.trim();
  if (clean.startsWith('[')) {
    try { return JSON.parse(clean); } catch { return []; }
  }
  return clean.replace(/^['"]|['"]$/g, '');
}

function parseNote(raw, path) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`笔记缺少 frontmatter：${path}`);
  const meta = {};
  match[1].split('\n').forEach((line) => {
    const index = line.indexOf(':');
    if (index > 0) meta[line.slice(0, index).trim()] = parseValue(line.slice(index + 1));
  });
  return {
    id: path.split('/').pop().replace(/\.md$/, ''),
    title: meta.title,
    date: meta.date,
    summary: meta.summary,
    tags: meta.tags || [],
    kind: meta.kind || '知识笔记',
    body: match[2].trim(),
    source: 'builtin',
  };
}

export const builtInNotes = Object.entries(noteFiles)
  .map(([path, raw]) => parseNote(raw, path))
  .sort((a, b) => b.date.localeCompare(a.date));
