/* Base64 encode / decode. */
function Base64Tool({ onBack }) {
  const [mode, setMode] = React.useState('encode');
  const [text, setText] = React.useState('');
  let out = '';
  try {
    out =
      mode === 'encode'
        ? btoa(unescape(encodeURIComponent(text)))
        : decodeURIComponent(escape(atob(text)));
  } catch (e) {
    out = text ? '⚠ Not valid Base64' : '';
  }

  return (
    <div className="content-inner fade-up">
      <button className="back-btn" onClick={onBack}>
        <Icon name="arrow-left" size={16} /> All tools
      </button>
      <div className="page-head">
        <div className="eyebrow">Encode</div>
        <h1 className="page-title">
          <b>Base64</b>
        </h1>
      </div>
      <div className="panel">
        <div style={{ marginBottom: 22 }}>
          <Segmented
            options={[
              { value: 'encode', label: 'Encode' },
              { value: 'decode', label: 'Decode' },
            ]}
            value={mode}
            onChange={setMode}
          />
        </div>
        <div className="grid-2">
          <div className="field">
            <span className="field-label">
              {mode === 'encode' ? 'Plain text' : 'Base64'}
            </span>
            <textarea
              className="textarea input-mono"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste here…"
            />
          </div>
          <div className="field">
            <span className="field-label">
              {mode === 'encode' ? 'Base64' : 'Plain text'}
            </span>
            <textarea
              className="textarea input-mono"
              value={out}
              readOnly
              placeholder="Result"
            />
          </div>
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}
        >
          <Button
            variant="primary"
            icon="copy"
            onClick={() => out && copy(out)}
          >
            Copy result
          </Button>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { Base64Tool });
