/* Color tool — pick a color, read it in every format. */
function hexToRgb(hex) {
  const m = hex.replace('#', '');
  const v =
    m.length === 3
      ? m
          .split('')
          .map((c) => c + c)
          .join('')
      : m;
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
}
function rgbToHsl({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function ColorTool({ onBack }) {
  const brand = [
    '#A9503B',
    '#CE8A52',
    '#E6E0D2',
    '#91A38D',
    '#5E7B8E',
    '#41506E',
    '#2C2D35',
    '#CBB9A4',
  ];
  const [hex, setHex] = React.useState('#B49A78');
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  const rows = [
    { k: 'HEX', v: hex.toUpperCase() },
    { k: 'RGB', v: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { k: 'HSL', v: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
  ];

  return (
    <div className="content-inner fade-up">
      <button className="back-btn" onClick={onBack}>
        <Icon name="arrow-left" size={16} /> All tools
      </button>
      <div className="page-head">
        <div className="eyebrow">Inspect</div>
        <h1 className="page-title">
          <b>Color picker</b>
        </h1>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="color-preview" style={{ background: hex }}></div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginTop: 20,
            }}
          >
            <label
              className="swap-btn"
              style={{
                width: 46,
                height: 46,
                overflow: 'hidden',
                position: 'relative',
                borderRadius: 'var(--r-md)',
                background: hex,
              }}
            >
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                style={{
                  position: 'absolute',
                  inset: -4,
                  width: 60,
                  height: 60,
                  border: 'none',
                  cursor: 'pointer',
                  opacity: 0,
                }}
              />
            </label>
            <div className="field" style={{ flex: 1 }}>
              <span className="field-label">Hex</span>
              <input
                className="input input-mono"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
              />
            </div>
          </div>
          <div style={{ marginTop: 22 }}>
            <div className="field-label" style={{ marginBottom: 12 }}>
              Brand swatches
            </div>
            <div className="swatch-row">
              {brand.map((c) => (
                <button
                  key={c}
                  className="swatch"
                  style={{ background: c }}
                  onClick={() => setHex(c)}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="field-label" style={{ marginBottom: 16 }}>
            Values
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rows.map((r) => (
              <div className="code-row" key={r.k}>
                <span className="k">{r.k}</span>
                <span
                  style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <span className="v">{r.v}</span>
                  <button
                    className="copy-mini"
                    onClick={() => copy(r.v)}
                    title="Copy"
                  >
                    <Icon name="copy" size={15} />
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { ColorTool });
