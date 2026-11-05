const SKIP = new Set(['script', 'style', 'head', 'noscript', 'template']);

const escapeText = (s: string) => s.replace(/([\\`*_[\]])/g, '\\$1');

const block = (s: string) => {
  const body = s.trim();
  return body ? `\n\n${body}\n\n` : '';
};

function wrap(content: string, mark: string): string {
  const inner = content.trim();
  if (!inner) return content;
  const lead = /^\s/.test(content) ? ' ' : '';
  const trail = /\s$/.test(content) ? ' ' : '';
  return `${lead}${mark}${inner}${mark}${trail}`;
}

function children(el: Node, inPre = false): string {
  return Array.from(el.childNodes)
    .map((n) => convert(n, inPre))
    .join('');
}

function list(el: Element, ordered: boolean): string {
  const start = ordered
    ? Number.parseInt(el.getAttribute('start') ?? '1', 10) || 1
    : 0;
  const items = Array.from(el.children)
    .filter((c) => c.tagName.toLowerCase() === 'li')
    .map((li, i) => {
      const marker = ordered ? `${start + i}. ` : '- ';
      const body = children(li)
        .trim()
        .replace(/\n{2,}/g, '\n');
      const pad = ' '.repeat(marker.length);
      return marker + body.replace(/\n/g, `\n${pad}`);
    });
  return block(items.join('\n'));
}

function table(el: Element): string {
  const rows = Array.from(el.querySelectorAll('tr')).map((tr) =>
    Array.from(tr.children)
      .filter((c) => /^(td|th)$/i.test(c.tagName))
      .map((c) =>
        children(c)
          .trim()
          .replace(/\s*\n+\s*/g, ' ')
          .replace(/\|/g, '\\|'),
      ),
  );
  if (!rows.length) return '';
  const cols = Math.max(...rows.map((r) => r.length));
  const line = (r: string[]) =>
    `| ${Array.from({ length: cols }, (_, i) => r[i] ?? '').join(' | ')} |`;
  const sep = `| ${Array.from({ length: cols }, () => '---').join(' | ')} |`;
  return block([line(rows[0]), sep, ...rows.slice(1).map(line)].join('\n'));
}

function convert(node: Node, inPre = false): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? '';
    return inPre ? text : escapeText(text.replace(/\s+/g, ' '));
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return '';

  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  if (SKIP.has(tag)) return '';

  switch (tag) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return block(
        `${'#'.repeat(Number(tag[1]))} ${children(el)
          .trim()
          .replace(/\s*\n+\s*/g, ' ')}`,
      );
    case 'p':
    case 'div':
    case 'section':
    case 'article':
    case 'header':
    case 'footer':
    case 'main':
    case 'figure':
    case 'figcaption':
      return block(children(el));
    case 'br':
      return '  \n';
    case 'hr':
      return block('---');
    case 'strong':
    case 'b':
      return wrap(children(el), '**');
    case 'em':
    case 'i':
      return wrap(children(el), '_');
    case 'del':
    case 's':
    case 'strike':
      return wrap(children(el), '~~');
    case 'code': {
      const text = el.textContent ?? '';
      const fence = text.includes('`') ? '``' : '`';
      return text ? `${fence}${text}${fence}` : '';
    }
    case 'pre': {
      const code = el.querySelector('code');
      const lang = /language-([\w+#-]+)/.exec(code?.className ?? '')?.[1] ?? '';
      const text = (code ?? el).textContent?.replace(/\n$/, '') ?? '';
      return block(`\`\`\`${lang}\n${text}\n\`\`\``);
    }
    case 'a': {
      const href = el.getAttribute('href');
      const text = children(el).trim();
      if (!href) return text;
      return `[${text || href}](${href})`;
    }
    case 'img': {
      const src = el.getAttribute('src');
      return src ? `![${el.getAttribute('alt') ?? ''}](${src})` : '';
    }
    case 'ul':
      return list(el, false);
    case 'ol':
      return list(el, true);
    case 'blockquote':
      return block(
        children(el)
          .trim()
          .split('\n')
          .map((l) => (l ? `> ${l}` : '>'))
          .join('\n'),
      );
    case 'table':
      return table(el);
    default:
      return children(el, inPre);
  }
}

export function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return children(doc.body)
    .replace(/[ \t]+\n/g, (m) => (m.startsWith('  ') ? '  \n' : '\n'))
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
