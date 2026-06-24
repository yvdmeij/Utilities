<script lang="ts">
  import { ArrowLeft, Copy, ImageUp, RotateCcw, ZoomIn } from 'lucide-svelte';
  import { copy } from '../toast';
  import Segmented from '../components/Segmented.svelte';

  let { onBack }: { onBack: () => void } = $props();

  const brand = ['#A9503B', '#CE8A52', '#E6E0D2', '#91A38D', '#5E7B8E', '#41506E', '#2C2D35', '#CBB9A4'];

  type Mode = 'manual' | 'image';
  const modeOptions: { value: Mode; label: string }[] = [
    { value: 'manual', label: 'Manual' },
    { value: 'image', label: 'From image' },
  ];

  // Number of pixels shown in the magnifier in each direction
  const CELLS = 11;
  // Magnifier canvas size in CSS/HTML pixels — each cell is MAG_SIZE/CELLS px wide
  const MAG_SIZE = 165;

  let hex = $state('#B49A78');
  let mode = $state<Mode>('manual');
  let imageLoaded = $state(false);
  let hoverHex = $state<string | null>(null);
  let magnifierVisible = $state(false);
  let magnifierX = $state(0);
  let magnifierY = $state(0);
  // Source-image pixel at the center of the magnifier (set while hovering the image canvas)
  let magAnchorX = $state(0);
  let magAnchorY = $state(0);
  // Which cell in the magnifier the cursor is currently over
  let magHoverCell = $state<{ x: number; y: number } | null>(null);
  let isHoveringMagnifier = $state(false);
  let magLeaveTimer: ReturnType<typeof setTimeout> | undefined;

  let zoom = $state(1);
  let panX = $state(0);
  let panY = $state(0);
  let dragOver = $state(false);
  let pendingImg = $state<HTMLImageElement | null>(null);

  let sourceCanvas: HTMLCanvasElement | undefined = $state();
  let displayCanvas: HTMLCanvasElement | undefined = $state();
  let magnifierCanvas: HTMLCanvasElement | undefined = $state();

  const activeHex = $derived(hoverHex ?? hex);

  $effect(() => {
    if (pendingImg && displayCanvas && sourceCanvas) {
      const img = pendingImg;
      sourceCanvas.width = img.naturalWidth;
      sourceCanvas.height = img.naturalHeight;
      sourceCanvas.getContext('2d')!.drawImage(img, 0, 0);
      displayCanvas.width = img.naturalWidth;
      displayCanvas.height = img.naturalHeight;
      redrawDisplay();
      pendingImg = null;
    }
  });

  // Non-passive wheel listener so we can call preventDefault
  $effect(() => {
    if (!displayCanvas) return;
    const el = displayCanvas;
    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      if (!sourceCanvas) return;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      const viewW = sourceCanvas.width / zoom;
      const viewH = sourceCanvas.height / zoom;
      const curX = panX + nx * viewW;
      const curY = panY + ny * viewH;
      const factor = e.deltaY < 0 ? 1.3 : 1 / 1.3;
      const newZoom = Math.max(1, Math.min(zoom * factor, 20));
      if (newZoom === 1) {
        panX = 0;
        panY = 0;
      } else {
        const nViewW = sourceCanvas.width / newZoom;
        const nViewH = sourceCanvas.height / newZoom;
        panX = Math.max(0, Math.min(curX - nx * nViewW, sourceCanvas.width - nViewW));
        panY = Math.max(0, Math.min(curY - ny * nViewH, sourceCanvas.height - nViewH));
      }
      zoom = newZoom;
      redrawDisplay();
    }
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  });

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

  const rgb = $derived(hexToRgb(activeHex));
  const hsl = $derived(rgbToHsl(rgb));

  function toHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
  }

  function hslToRgb(h: number, s: number, l: number) {
    s /= 100; l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
  }

  function parseHex(val: string): string | null {
    const clean = val.trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{6}$/.test(clean)) return '#' + clean.toLowerCase();
    if (/^[0-9a-fA-F]{3}$/.test(clean)) return '#' + clean.split('').map((c) => c + c).join('').toLowerCase();
    return null;
  }

  function parseRgb(val: string): string | null {
    const m = val.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    if (!m) return null;
    const r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3]);
    if ([r, g, b].some((n) => n > 255)) return null;
    return toHex(r, g, b);
  }

  function parseHsl(val: string): string | null {
    const m = val.match(/(\d+)[,\s]+(\d+)%?[,\s]+(\d+)%?/);
    if (!m) return null;
    const h = parseInt(m[1]), s = parseInt(m[2]), l = parseInt(m[3]);
    if (h > 360 || s > 100 || l > 100) return null;
    return toHex(...Object.values(hslToRgb(h, s, l)) as [number, number, number]);
  }

  // Editable value inputs — synced from derived state unless actively editing
  let hexInput = $state('');
  let rgbInput = $state('');
  let hslInput = $state('');
  let activeEdit = $state<string | null>(null);

  $effect(() => {
    if (activeEdit !== 'HEX') hexInput = activeHex.toUpperCase();
    if (activeEdit !== 'RGB') rgbInput = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    if (activeEdit !== 'HSL') hslInput = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  });

  function onValueFocus(field: string) {
    activeEdit = field;
  }

  function onValueInput(field: string, val: string) {
    if (field === 'HEX') { hexInput = val; const p = parseHex(val); if (p) hex = p; }
    else if (field === 'RGB') { rgbInput = val; const p = parseRgb(val); if (p) hex = p; }
    else if (field === 'HSL') { hslInput = val; const p = parseHsl(val); if (p) hex = p; }
  }

  function onValueBlur() {
    activeEdit = null;
  }

  function onValueKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === 'Escape') (e.target as HTMLInputElement).blur();
  }

  function redrawDisplay() {
    if (!displayCanvas || !sourceCanvas) return;
    const ctx = displayCanvas.getContext('2d')!;
    const dW = displayCanvas.width;
    const dH = displayCanvas.height;
    const viewW = dW / zoom;
    const viewH = dH / zoom;
    ctx.imageSmoothingEnabled = zoom < 3;
    ctx.clearRect(0, 0, dW, dH);
    ctx.drawImage(sourceCanvas, panX, panY, viewW, viewH, 0, 0, dW, dH);
  }

  function samplePixel(srcX: number, srcY: number): string {
    const [r, g, b] = sourceCanvas!.getContext('2d')!.getImageData(srcX, srcY, 1, 1).data;
    return toHex(r, g, b);
  }

  function drawMagnifier(srcX: number, srcY: number) {
    const magCtx = magnifierCanvas!.getContext('2d')!;
    const size = magnifierCanvas!.width;
    const cell = size / CELLS;

    const sx = Math.max(0, Math.min(srcX - Math.floor(CELLS / 2), sourceCanvas!.width - CELLS));
    const sy = Math.max(0, Math.min(srcY - Math.floor(CELLS / 2), sourceCanvas!.height - CELLS));

    magCtx.clearRect(0, 0, size, size);
    magCtx.imageSmoothingEnabled = false;
    magCtx.drawImage(sourceCanvas!, sx, sy, CELLS, CELLS, 0, 0, size, size);

    // Pixel grid
    magCtx.strokeStyle = 'rgba(0,0,0,0.15)';
    magCtx.lineWidth = 0.5;
    for (let i = 1; i < CELLS; i++) {
      const p = i * cell;
      magCtx.beginPath(); magCtx.moveTo(p, 0); magCtx.lineTo(p, size); magCtx.stroke();
      magCtx.beginPath(); magCtx.moveTo(0, p); magCtx.lineTo(size, p); magCtx.stroke();
    }

    // Highlighted cell: hovered cell in magnifier, or center cell when on image
    const hCell = magHoverCell ?? { x: Math.floor(CELLS / 2), y: Math.floor(CELLS / 2) };
    const cx = hCell.x * cell;
    const cy = hCell.y * cell;
    magCtx.strokeStyle = 'rgba(255,255,255,0.9)';
    magCtx.lineWidth = 2;
    magCtx.strokeRect(cx + 1, cy + 1, cell - 2, cell - 2);
    magCtx.strokeStyle = 'rgba(0,0,0,0.75)';
    magCtx.lineWidth = 1;
    magCtx.strokeRect(cx, cy, cell, cell);
  }

  // ── Source coordinate helpers ─────────────────────────────────────────────

  function getSourceCoords(e: MouseEvent) {
    const rect = displayCanvas!.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    const viewW = sourceCanvas!.width / zoom;
    const viewH = sourceCanvas!.height / zoom;
    return {
      srcX: Math.max(0, Math.min(Math.floor(panX + nx * viewW), sourceCanvas!.width - 1)),
      srcY: Math.max(0, Math.min(Math.floor(panY + ny * viewH), sourceCanvas!.height - 1)),
    };
  }

  function magnifierCellToSrc(cellX: number, cellY: number) {
    const sx = Math.max(0, Math.min(magAnchorX - Math.floor(CELLS / 2), sourceCanvas!.width - CELLS));
    const sy = Math.max(0, Math.min(magAnchorY - Math.floor(CELLS / 2), sourceCanvas!.height - CELLS));
    return {
      srcX: Math.min(sx + cellX, sourceCanvas!.width - 1),
      srcY: Math.min(sy + cellY, sourceCanvas!.height - 1),
    };
  }

  // ── Image canvas events ───────────────────────────────────────────────────

  function onCanvasMouseMove(e: MouseEvent) {
    if (isHoveringMagnifier) return;

    const { srcX, srcY } = getSourceCoords(e);
    magAnchorX = srcX;
    magAnchorY = srcY;
    hoverHex = samplePixel(srcX, srcY);
    magHoverCell = null;
    drawMagnifier(srcX, srcY);

    const OFF = 16;
    const cW = displayCanvas!.offsetWidth;
    let mx = e.offsetX + OFF;
    let my = e.offsetY - MAG_SIZE - OFF;
    if (my < 0) my = e.offsetY + OFF;
    if (mx + MAG_SIZE > cW) mx = e.offsetX - MAG_SIZE - OFF;
    if (mx < 0) mx = 0;
    magnifierX = mx;
    magnifierY = my;
    magnifierVisible = true;
  }

  function onCanvasClick(e: MouseEvent) {
    const { srcX, srcY } = getSourceCoords(e);
    hex = samplePixel(srcX, srcY);
  }

  function onCanvasLeave() {
    clearTimeout(magLeaveTimer);
    magLeaveTimer = setTimeout(() => {
      if (!isHoveringMagnifier) {
        magnifierVisible = false;
        hoverHex = null;
        magHoverCell = null;
      }
    }, 60);
  }

  function onCanvasDoubleClick() {
    zoom = 1;
    panX = 0;
    panY = 0;
    redrawDisplay();
  }

  // ── Magnifier canvas events ───────────────────────────────────────────────

  function onMagnifierEnter() {
    clearTimeout(magLeaveTimer);
    isHoveringMagnifier = true;
    magnifierVisible = true;
  }

  function onMagnifierMouseMove(e: MouseEvent) {
    const size = magnifierCanvas!.width;
    const cellSize = size / CELLS;
    const cellX = Math.min(Math.floor(e.offsetX / cellSize), CELLS - 1);
    const cellY = Math.min(Math.floor(e.offsetY / cellSize), CELLS - 1);
    magHoverCell = { x: cellX, y: cellY };
    const { srcX, srcY } = magnifierCellToSrc(cellX, cellY);
    hoverHex = samplePixel(srcX, srcY);
    drawMagnifier(magAnchorX, magAnchorY);
  }

  function onMagnifierClick() {
    if (!magHoverCell) return;
    const { srcX, srcY } = magnifierCellToSrc(magHoverCell.x, magHoverCell.y);
    hex = samplePixel(srcX, srcY);
  }

  function onMagnifierLeave() {
    isHoveringMagnifier = false;
    magnifierVisible = false;
    hoverHex = null;
    magHoverCell = null;
  }

  // ── File handling ─────────────────────────────────────────────────────────

  function loadImage(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      zoom = 1;
      panX = 0;
      panY = 0;
      imageLoaded = true;
      pendingImg = img;
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function handleFileInput(e: Event) {
    const file = (e.currentTarget as HTMLInputElement).files?.[0];
    if (file) loadImage(file);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file?.type.startsWith('image/')) loadImage(file);
  }

  $effect(() => {
    if (mode !== 'image') return;
    function handlePaste(e: ClipboardEvent) {
      for (const item of Array.from(e.clipboardData?.items ?? [])) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) { loadImage(file); break; }
        }
      }
    }
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  });

  function resetImage() {
    imageLoaded = false;
    hoverHex = null;
    magnifierVisible = false;
    magHoverCell = null;
    isHoveringMagnifier = false;
    zoom = 1;
    panX = 0;
    panY = 0;
  }
</script>

<div class="content-inner fade-up">
  <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> All tools</button>
  <div class="page-head">
    <div class="eyebrow">Inspect</div>
    <h1 class="page-title"><b>Color picker</b></h1>
  </div>

  <div style="margin-bottom:20px">
    <Segmented options={modeOptions} value={mode} onChange={(v) => (mode = v)} />
  </div>

  <div class="grid-2">
    <div class="panel">
      {#if mode === 'manual'}
        <div class="color-preview" style="background:{hex}"></div>
        <div style="margin-top:20px">
          <label class="color-pick-btn">
            <span class="color-pick-swatch" style="background:{hex}"></span>
            Pick a color
            <input
              type="color"
              value={hex}
              oninput={(e) => (hex = e.currentTarget.value)}
              style="position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer"
            />
          </label>
        </div>
        <div style="margin-top:22px">
          <div class="field-label" style="margin-bottom:12px">Brand swatches</div>
          <div class="swatch-row">
            {#each brand as c (c)}
              <button class="swatch" style="background:{c}" onclick={() => (hex = c)} title={c} aria-label={c}></button>
            {/each}
          </div>
        </div>
      {:else}
        <canvas bind:this={sourceCanvas} style="position:absolute;width:0;height:0;visibility:hidden" aria-hidden="true"></canvas>
        <div class="color-preview" style="background:{activeHex}"></div>

        {#if !imageLoaded}
          <label
            class="image-drop-zone"
            class:dragover={dragOver}
            ondrop={handleDrop}
            ondragover={handleDragOver}
            ondragleave={() => (dragOver = false)}
            style="margin-top:16px"
          >
            <ImageUp size={26} />
            <span>Click, drag or paste an image</span>
            <input type="file" accept="image/*" style="display:none" onchange={handleFileInput} />
          </label>
        {:else}
          <div class="image-picker-wrap" style="margin-top:16px">
            <div class="canvas-wrapper">
              <canvas
                bind:this={displayCanvas}
                class="image-canvas"
                onmousemove={onCanvasMouseMove}
                onclick={onCanvasClick}
                onmouseleave={onCanvasLeave}
                ondblclick={onCanvasDoubleClick}
              ></canvas>
            </div>
            {#if zoom > 1.05}
              <div class="zoom-badge">{zoom.toFixed(zoom < 10 ? 1 : 0)}×</div>
            {/if}
            <canvas
              bind:this={magnifierCanvas}
              class="magnifier-canvas"
              style:display={magnifierVisible ? 'block' : 'none'}
              style:top="{magnifierY}px"
              style:left="{magnifierX}px"
              width={MAG_SIZE}
              height={MAG_SIZE}
              onmouseenter={onMagnifierEnter}
              onmousemove={onMagnifierMouseMove}
              onclick={onMagnifierClick}
              onmouseleave={onMagnifierLeave}
            ></canvas>
          </div>
          <div class="image-mode-actions">
            <span class="image-hint">
              <ZoomIn size={12} />
              Scroll to zoom · double-click to reset
            </span>
            <button class="change-image-btn" onclick={resetImage}>
              <RotateCcw size={12} />
              Change image
            </button>
          </div>
        {/if}
      {/if}
    </div>

    <div class="panel">
      <div class="field-label" style="margin-bottom:16px">Values</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        {#each [
          { k: 'HEX', val: hexInput, copy: activeHex.toUpperCase() },
          { k: 'RGB', val: rgbInput, copy: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
          { k: 'HSL', val: hslInput, copy: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
        ] as row (row.k)}
          <div class="code-row">
            <span class="k">{row.k}</span>
            <span style="display:flex;align-items:center;gap:8px;min-width:0">
              <input
                class="v-input"
                value={row.val}
                onfocus={() => onValueFocus(row.k)}
                oninput={(e) => onValueInput(row.k, e.currentTarget.value)}
                onblur={onValueBlur}
                onkeydown={onValueKeyDown}
                spellcheck={false}
              />
              <button class="copy-mini" onclick={() => copy(row.copy)} title="Copy" aria-label="Copy {row.k}">
                <Copy size={15} />
              </button>
            </span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
