/* Pomodoro / countdown timer. */
function Timer({ onBack }) {
  const presets = [
    { value: 300, label: '5m' },
    { value: 900, label: '15m' },
    { value: 1500, label: '25m' },
    { value: 3000, label: '50m' },
  ];
  const [total, setTotal] = React.useState(1500);
  const [left, setLeft] = React.useState(1500);
  const [running, setRunning] = React.useState(false);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          clearInterval(id);
          setRunning(false);
          window.toast('Time’s up', 'bell');
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const pick = (v) => {
    setTotal(v);
    setLeft(v);
    setRunning(false);
  };
  const reset = () => {
    setLeft(total);
    setRunning(false);
  };

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const pct = total ? left / total : 0;
  const R = 110,
    C = 2 * Math.PI * R;

  return (
    <div className="content-inner fade-up">
      <button className="back-btn" onClick={onBack}>
        <Icon name="arrow-left" size={16} /> All tools
      </button>
      <div className="page-head">
        <div className="eyebrow">Focus</div>
        <h1 className="page-title">
          <b>Timer</b>
        </h1>
      </div>

      <div className="panel">
        <div className="timer-wrap">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Segmented
              options={presets.map((p) => ({ value: p.value, label: p.label }))}
              value={total}
              onChange={pick}
            />
          </div>

          <div className="timer-dial">
            <svg width="240" height="240">
              <circle
                cx="120"
                cy="120"
                r={R}
                fill="none"
                stroke="var(--bg-sunken)"
                strokeWidth="10"
              />
              <circle
                cx="120"
                cy="120"
                r={R}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - pct)}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="time">
              <div className="readout" style={{ fontSize: 56 }}>
                {mm}:{ss}
              </div>
              <div className="field-label" style={{ marginTop: 10 }}>
                {running ? 'Running' : left === 0 ? 'Done' : 'Paused'}
              </div>
            </div>
          </div>

          <div className="timer-controls">
            <Button
              variant="primary"
              icon={running ? 'pause' : 'play'}
              onClick={() => left > 0 && setRunning((r) => !r)}
            >
              {running ? 'Pause' : 'Start'}
            </Button>
            <Button variant="secondary" icon="rotate-ccw" onClick={reset}>
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { Timer });
