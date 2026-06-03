<script lang="ts">
  import { ArrowLeft, ArrowLeftRight, Copy } from 'lucide-svelte';
  import Button from '../components/Button.svelte';
  import Segmented from '../components/Segmented.svelte';
  import { copy } from '../toast';

  const UNIT_DATA: Record<string, { units: Record<string, number> }> = {
    Length: {
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
    Weight: { units: { Gram: 1, Kilogram: 1000, Ounce: 28.3495, Pound: 453.592, Tonne: 1e6 } },
    Volume: {
      units: { Millilitre: 0.001, Litre: 1, 'Cup (US)': 0.2366, 'Pint (US)': 0.4732, Gallon: 3.78541 },
    },
    Data: { units: { Byte: 1, Kilobyte: 1024, Megabyte: 1048576, Gigabyte: 1073741824 } },
  };

  let { onBack, initialCat = 'Length' }: { onBack: () => void; initialCat?: string } = $props();

  const cats = Object.keys(UNIT_DATA);
  let cat = $state('Length');
  let from = $state('Millimetre');
  let to = $state('Metre');
  let val = $state('1');

  const units = $derived(Object.keys(UNIT_DATA[cat].units));

  // Follow the category supplied by the menu tree.
  $effect(() => {
    cat = initialCat;
  });

  // Reset unit selection whenever the category changes.
  $effect(() => {
    const u = Object.keys(UNIT_DATA[cat].units);
    from = u[0];
    to = u[2] ?? u[1];
  });

  const result = $derived.by(() => {
    const f = UNIT_DATA[cat].units[from];
    const t = UNIT_DATA[cat].units[to];
    const n = Number.parseFloat(val);
    if (Number.isNaN(n) || f === undefined || t === undefined) return null;
    return (n * f) / t;
  });

  const fmt = (x: number) => x.toLocaleString('en-US', { maximumFractionDigits: 6 });

  function swap() {
    [from, to] = [to, from];
  }
</script>

<div class="content-inner fade-up">
  <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> All tools</button>
  <div class="page-head">
    <div class="eyebrow">Convert</div>
    <h1 class="page-title"><b>Unit converter</b></h1>
  </div>

  <div class="panel">
    <div style="margin-bottom:24px">
      <Segmented
        options={cats.map((c) => ({ value: c, label: c }))}
        value={cat}
        onChange={(c) => (cat = c)}
      />
    </div>

    <div class="swap-row">
      <div class="field" style="flex:1">
        <span class="field-label">From</span>
        <div class="unit-field">
          <input value={val} inputmode="decimal" oninput={(e) => (val = e.currentTarget.value)} />
          <select class="unit-select" bind:value={from}>
            {#each units as u (u)}<option>{u}</option>{/each}
          </select>
        </div>
      </div>
      <button class="swap-btn" onclick={swap} title="Swap"><ArrowLeftRight size={17} /></button>
      <div class="field" style="flex:1">
        <span class="field-label">To</span>
        <div class="unit-field">
          <input value={result === null ? '' : fmt(result)} readonly />
          <select class="unit-select" bind:value={to}>
            {#each units as u (u)}<option>{u}</option>{/each}
          </select>
        </div>
      </div>
    </div>
  </div>

  <div
    class="panel"
    style="display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap"
  >
    <div>
      <div class="field-label" style="margin-bottom:12px">Result</div>
      <div class="readout conv-readout">
        {result === null ? '—' : fmt(result)}
        <span class="conv-unit">{to.toLowerCase()}</span>
      </div>
    </div>
    <Button variant="primary" icon={Copy} onclick={() => result !== null && copy(fmt(result))}>
      Copy result
    </Button>
  </div>
</div>
