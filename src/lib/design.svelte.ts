import paperCss from '../app.css?inline';
import glassCss from '../glass.css?inline';

export type Design = 'glass' | 'paper';

export const DESIGNS: Design[] = ['glass', 'paper'];

const DESIGN_KEY = 'quietkit:design';
const STYLESHEETS: Record<Design, string> = {
  glass: glassCss,
  paper: paperCss,
};

function readDesign(): Design {
  try {
    const stored = localStorage.getItem(DESIGN_KEY);
    if (stored === 'glass' || stored === 'paper') return stored;
  } catch {
    // Storage unavailable (private mode) — fall back to the default design.
  }
  return 'glass';
}

export const design = $state<{ current: Design }>({ current: readDesign() });

// Each design is a complete stylesheet; only the active one is in the document.
const styleEl = document.createElement('style');
styleEl.id = 'design-css';
document.head.appendChild(styleEl);

function apply(d: Design) {
  styleEl.textContent = STYLESHEETS[d];
  document.documentElement.dataset.design = d;
}

export function setDesign(d: Design): void {
  design.current = d;
  apply(d);
  try {
    localStorage.setItem(DESIGN_KEY, d);
  } catch {
    // Ignore storage failures — the choice just won't persist.
  }
}

apply(design.current);

// Chromium-only progressive enhancement: the glass refraction filter.
const brands = (
  navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }
).userAgentData?.brands;
document.documentElement.dataset.refract = brands?.some((b) =>
  /Chromium/.test(b.brand),
)
  ? 'on'
  : 'off';

// The glass specular highlight follows the pointer: one document-level listener
// writes the pointer position, relative to the hovered control, into --mx/--my.
const SPECULAR =
  '.qk-btn,.qk-swap,.qk-ibtn,.qk-search,.qk-seg,.qk-tile,.qk-menu,.qk-toast';
document.addEventListener('pointermove', (e) => {
  if (design.current !== 'glass') return;
  const el = (e.target as Element | null)?.closest?.(
    SPECULAR,
  ) as HTMLElement | null;
  if (!el) return;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
});
