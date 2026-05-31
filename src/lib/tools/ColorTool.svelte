<script lang="ts">
  import { ArrowLeft, Copy } from 'lucide-svelte';
  import { copy } from '../toast';

  let { onBack }: { onBack: () => void } = $props();

  const brand = ['#A9503B', '#CE8A52', '#E6E0D2', '#91A38D', '#5E7B8E', '#41506E', '#2C2D35', '#CBB9A4'];

  let hex = $state('#B49A78');

  function hexToRgb(value: string) {
    const m = value.replace('#', '');
    const v = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
    return {
      r: Number.parseInt(v.slice(0, 2), 16),
      g: Number.parseInt(v.slice(2, 4), 16),
      b: Number.parseInt(v.slice(4, 6), 16),
    };
  }

  function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  const rgb = $derived(hexToRgb(hex));
  const hsl = $derived(rgbToHsl(rgb));
  const rows = $derived([
    { k: 'HEX', v: hex.toUpperCase() },
    { k: 'RGB', v: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { k: 'HSL', v: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
  ]);
</script>

<div class="content-inner fade-up">
  <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> All tools</button>
  <div class="page-head">
    <div class="eyebrow">Inspect</div>
    <h1 class="page-title"><b>Color picker</b></h1>
  </div>

  <div class="grid-2">
    <div class="panel">
      <div class="color-preview" style="background:{hex}"></div>
      <div style="display:flex;align-items:center;gap:14px;margin-top:20px">
        <label
          class="swap-btn"
          style="width:46px;height:46px;overflow:hidden;position:relative;border-radius:var(--r-md);background:{hex}"
        >
          <input
            type="color"
            value={hex}
            oninput={(e) => (hex = e.currentTarget.value)}
            style="position:absolute;inset:-4px;width:60px;height:60px;border:none;cursor:pointer;opacity:0"
          />
        </label>
        <div class="field" style="flex:1">
          <span class="field-label">Hex</span>
          <input class="input input-mono" value={hex} oninput={(e) => (hex = e.currentTarget.value)} />
        </div>
      </div>
      <div style="margin-top:22px">
        <div class="field-label" style="margin-bottom:12px">Brand swatches</div>
        <div class="swatch-row">
          {#each brand as c (c)}
            <button class="swatch" style="background:{c}" onclick={() => (hex = c)} title={c} aria-label={c}></button>
          {/each}
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="field-label" style="margin-bottom:16px">Values</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        {#each rows as row (row.k)}
          <div class="code-row">
            <span class="k">{row.k}</span>
            <span style="display:flex;align-items:center;gap:12px">
              <span class="v">{row.v}</span>
              <button class="copy-mini" onclick={() => copy(row.v)} title="Copy" aria-label="Copy {row.k}">
                <Copy size={15} />
              </button>
            </span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
