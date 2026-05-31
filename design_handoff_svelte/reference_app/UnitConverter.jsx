/* Unit converter tool. */
const UNIT_DATA = {
  Length: {
    base: 'm',
    units: {
      Millimetre: 0.001,
      Centimetre: 0.01,
      Metre: 1,
      Kilometre: 1000,
      Inch: 0.0254,
      Foot: 0.3048,
      Mile: 1609.344,
    },
  },
  Weight: {
    base: 'g',
    units: {
      Gram: 1,
      Kilogram: 1000,
      Ounce: 28.3495,
      Pound: 453.592,
      Tonne: 1e6,
    },
  },
  Volume: {
    base: 'l',
    units: {
      Millilitre: 0.001,
      Litre: 1,
      'Cup (US)': 0.2366,
      'Pint (US)': 0.4732,
      Gallon: 3.78541,
    },
  },
  Data: {
    base: 'B',
    units: { Byte: 1, Kilobyte: 1024, Megabyte: 1048576, Gigabyte: 1073741824 },
  },
};

function UnitConverter({ onBack, initialCat }) {
  const cats = Object.keys(UNIT_DATA);
  const [cat, setCat] = React.useState(initialCat || 'Length');
  React.useEffect(() => {
    if (initialCat) setCat(initialCat);
  }, [initialCat]);
  const units = Object.keys(UNIT_DATA[cat].units);
  const [from, setFrom] = React.useState(units[0]);
  const [to, setTo] = React.useState(units[2] || units[1]);
  const [val, setVal] = React.useState('1');

  React.useEffect(() => {
    const u = Object.keys(UNIT_DATA[cat].units);
    setFrom(u[0]);
    setTo(u[2] || u[1]);
  }, [cat]);

  const factorF = UNIT_DATA[cat].units[from];
  const factorT = UNIT_DATA[cat].units[to];
  const n = parseFloat(val);
  const result = isNaN(n) ? null : (n * factorF) / factorT;
  const fmt = (x) => x.toLocaleString('en-US', { maximumFractionDigits: 6 });

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="content-inner fade-up">
      <button className="back-btn" onClick={onBack}>
        <Icon name="arrow-left" size={16} /> All tools
      </button>
      <div className="page-head">
        <div className="eyebrow">Convert</div>
        <h1 className="page-title">
          <b>Unit converter</b>
        </h1>
      </div>

      <div className="panel">
        <div style={{ marginBottom: 24 }}>
          <Segmented
            options={cats.map((c) => ({ value: c, label: c }))}
            value={cat}
            onChange={setCat}
          />
        </div>

        <div className="swap-row">
          <div className="field" style={{ flex: 1 }}>
            <span className="field-label">From</span>
            <div className="unit-field">
              <input
                value={val}
                inputMode="decimal"
                onChange={(e) => setVal(e.target.value)}
              />
              <select
                className="unit-select"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
                {units.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="swap-btn" onClick={swap} title="Swap">
            <Icon name="arrow-left-right" size={17} />
          </button>
          <div className="field" style={{ flex: 1 }}>
            <span className="field-label">To</span>
            <div className="unit-field">
              <input value={result === null ? '' : fmt(result)} readOnly />
              <select
                className="unit-select"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                {units.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div
        className="panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div className="field-label" style={{ marginBottom: 12 }}>
            Result
          </div>
          <div className="readout" style={{ fontSize: 44 }}>
            {result === null ? '—' : fmt(result)}
            <span
              style={{ fontSize: 20, color: 'var(--ink-3)', marginLeft: 10 }}
            >
              {to.toLowerCase()}
            </span>
          </div>
        </div>
        <Button
          variant="primary"
          icon="copy"
          onClick={() => result !== null && copy(fmt(result))}
        >
          Copy result
        </Button>
      </div>
    </div>
  );
}
Object.assign(window, { UnitConverter });
