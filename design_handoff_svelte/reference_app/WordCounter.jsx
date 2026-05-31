/* Word & character counter. */
function WordCounter({ onBack }) {
  const [text, setText] = React.useState('');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const noSpace = text.replace(/\s/g, '').length;
  const sentences = text.trim()
    ? (text.match(/[.!?]+(\s|$)/g) || []).length || (text.trim() ? 1 : 0)
    : 0;
  const readMin = Math.max(words ? 1 : 0, Math.round(words / 200));
  const stats = [
    { n: words.toLocaleString(), l: 'Words' },
    { n: chars.toLocaleString(), l: 'Characters' },
    { n: noSpace.toLocaleString(), l: 'No spaces' },
    { n: sentences.toLocaleString(), l: 'Sentences' },
  ];

  return (
    <div className="content-inner fade-up">
      <button className="back-btn" onClick={onBack}>
        <Icon name="arrow-left" size={16} /> All tools
      </button>
      <div className="page-head">
        <div className="eyebrow">Write</div>
        <h1 className="page-title">
          <b>Word counter</b>
        </h1>
      </div>

      <div className="panel">
        <div className="stat-grid" style={{ marginBottom: 24 }}>
          {stats.map((s) => (
            <div className="stat" key={s.l}>
              <div className="stat-num">{s.n}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="field">
          <span className="field-label">Your text</span>
          <textarea
            className="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your text here…"
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 18,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span className="ds-body-sm muted">
            <Icon
              name="clock"
              size={14}
              style={{ verticalAlign: '-2px', marginRight: 6 }}
            />
            ~{readMin} min read
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="ghost" icon="eraser" onClick={() => setText('')}>
              Clear
            </Button>
            <Button variant="primary" icon="copy" onClick={() => copy(text)}>
              Copy text
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { WordCounter });
