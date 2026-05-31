/* Shared UI primitives for the Quiet Utility app kit. */

// Lucide icon wrapper — manages its own leaf DOM so React never fights it.
function Icon({ name, size = 18, className, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    el.appendChild(i);
    try {
      window.lucide.createIcons({ attrs: { width: size, height: size } });
    } catch (e) {}
  }, [name, size]);
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ display: 'inline-flex', ...style }}
    />
  );
}

function Button({ variant = 'secondary', icon, children, ...rest }) {
  return (
    <button className={`btn btn-${variant}`} {...rest}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button
          key={o.value}
          className={value === o.value ? 'on' : ''}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Global toast host. Call window.toast('Copied to clipboard').
function ToastHost() {
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    window.toast = (msg, icon = 'check') => {
      const id = Math.random().toString(36).slice(2);
      setItems((s) => [...s, { id, msg, icon }]);
      setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 2200);
    };
  }, []);
  return (
    <div className="toast-host">
      {items.map((t) => (
        <div key={t.id} className="toast">
          <Icon name={t.icon} size={16} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function copy(text) {
  try {
    navigator.clipboard.writeText(text);
  } catch (e) {}
  if (window.toast) window.toast('Copied to clipboard');
}

Object.assign(window, { Icon, Button, Segmented, ToastHost, copy });
