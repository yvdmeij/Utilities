/* Case converter. */
function CaseConverter({ onBack }) {
  const [text, setText] = React.useState('');
  const transforms = [
    { id: 'upper', label: 'UPPER', fn: (s) => s.toUpperCase() },
    { id: 'lower', label: 'lower', fn: (s) => s.toLowerCase() },
    {
      id: 'title',
      label: 'Title',
      fn: (s) =>
        s.replace(
          /\w\S*/g,
          (w) => w[0].toUpperCase() + w.slice(1).toLowerCase(),
        ),
    },
    {
      id: 'sentence',
      label: 'Sentence',
      fn: (s) =>
        s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
    },
  ];
  const [mode, setMode] = React.useState('upper');
  const out = transforms.find((t) => t.id === mode).fn(text);

  return (
    <div className="content-inner fade-up">
      <button className="back-btn" onClick={onBack}>
        <Icon name="arrow-left" size={16} /> All tools
      </button>
      <div className="page-head">
        <div className="eyebrow">Transform</div>
        <h1 className="page-title">
          <b>Case converter</b>
        </h1>
      </div>
      <div className="panel">
        <div style={{ marginBottom: 22 }}>
          <Segmented
            options={transforms.map((t) => ({ value: t.id, label: t.label }))}
            value={mode}
            onChange={setMode}
          />
        </div>
        <div className="grid-2">
          <div className="field">
            <span className="field-label">Input</span>
            <textarea
              className="textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type something…"
            />
          </div>
          <div className="field">
            <span className="field-label">Output</span>
            <textarea
              className="textarea"
              value={out}
              readOnly
              placeholder="Result appears here"
            />
          </div>
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}
        >
          <Button variant="primary" icon="copy" onClick={() => copy(out)}>
            Copy result
          </Button>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { CaseConverter });
