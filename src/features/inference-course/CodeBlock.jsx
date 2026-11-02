import { useEffect, useState } from 'react';
import { Check, Copy, SquareTerminal } from 'lucide-react';
export function CodeBlock({ code, title = '在终端执行', language = 'bash' }) {
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
