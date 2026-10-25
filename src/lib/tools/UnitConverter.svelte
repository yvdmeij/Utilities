<script lang="ts">
  import { ArrowLeft, ArrowLeftRight, ArrowUpDown, Copy } from 'lucide-svelte';
  import Button from '../components/Button.svelte';
  import Segmented from '../components/Segmented.svelte';
  import Seg from '../components/glass/Seg.svelte';
  import Select from '../components/glass/Select.svelte';
  import ToolPage from '../components/glass/ToolPage.svelte';
  import { design } from '../design.svelte';
  import { locale, type MessageKey, t } from '../i18n.svelte';
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
    const n = Number.parseFloat(val.replace(',', '.'));
    if (Number.isNaN(n) || f === undefined || t === undefined) return null;
    return (n * f) / t;
  });

  const fmt = (x: number) => x.toLocaleString(locale(), { maximumFractionDigits: 6 });

  const unitName = (u: string) => t(`unit.${u}` as MessageKey);

  function swap() {
    [from, to] = [to, from];
  }
</script>

{#if design.current === 'glass'}
  <ToolPage {onBack} eyebrow={t('eyebrow.convert')} title={t('unit.title')}>
    <div class="qk-card">
      <Seg
        options={cats.map((c) => ({ value: c, label: t(`cat.${c}` as MessageKey) }))}
        value={cat}
        onChange={(c) => (cat = c)}
      />
      <label class="qk-field">
        <span class="qk-label">{t('unit.value')}</span>
        <input
          class="qk-input qk-input-lg"
          inputmode="decimal"
          value={val}
          oninput={(e) => (val = e.currentTarget.value)}
        />
      </label>
      <div class="qk-swap-row">
        <div class="qk-field">
          <span class="qk-label">{t('common.from')}</span>
          <Select bind:value={from} label={t('common.from')}>
            {#each units as u (u)}<option value={u}>{unitName(u)}</option>{/each}
          </Select>
        </div>
        <button class="qk-swap" onclick={swap} aria-label={t('common.swap')} title={t('common.swap')}>
          <ArrowUpDown size={18} strokeWidth={1.75} />
        </button>
        <div class="qk-field">
          <span class="qk-label">{t('common.to')}</span>
          <Select bind:value={to} label={t('common.to')}>
            {#each units as u (u)}<option value={u}>{unitName(u)}</option>{/each}
          </Select>
        </div>
      </div>
      <div class="qk-divider"></div>
      <div class="qk-result">
        <div class="qk-result-main">
          <span class="qk-label">{t('common.result')}</span>
          <div class="qk-readout">
            {result === null ? '—' : fmt(result)}<span class="qk-unit">{unitName(to).toLowerCase()}</span>
          </div>
          {#if result !== null}
            <span class="qk-meta">
              {val} {unitName(from).toLowerCase()} = {fmt(result)} {unitName(to).toLowerCase()}
            </span>
          {/if}
        </div>
        <button
          class="qk-ibtn"
          disabled={result === null}
          onclick={() => result !== null && copy(fmt(result))}
          aria-label={t('common.copyResult')}
          title={t('common.copyResult')}
        >
          <Copy size={18} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  </ToolPage>
{:else}

  <div class="content-inner fade-up">
    <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> {t('menu.allTools')}</button>
    <div class="page-head">
      <div class="eyebrow">{t('eyebrow.convert')}</div>
      <h1 class="page-title"><b>{t('unit.title')}</b></h1>
    </div>

    <div class="panel">
      <div style="margin-bottom:24px">
        <Segmented
          options={cats.map((c) => ({ value: c, label: t(`cat.${c}` as MessageKey) }))}
          value={cat}
          onChange={(c) => (cat = c)}
        />
      </div>

      <div class="swap-row">
        <div class="field" style="flex:1">
          <span class="field-label">{t('common.from')}</span>
          <div class="unit-field">
            <input value={val} inputmode="decimal" oninput={(e) => (val = e.currentTarget.value)} />
            <select class="unit-select" bind:value={from}>
              {#each units as u (u)}<option value={u}>{t(`unit.${u}` as MessageKey)}</option>{/each}
            </select>
          </div>
        </div>
        <button class="swap-btn" onclick={swap} title={t('common.swap')}><ArrowLeftRight size={17} /></button>
        <div class="field" style="flex:1">
          <span class="field-label">{t('common.to')}</span>
          <div class="unit-field">
            <input value={result === null ? '' : fmt(result)} readonly />
            <select class="unit-select" bind:value={to}>
              {#each units as u (u)}<option value={u}>{t(`unit.${u}` as MessageKey)}</option>{/each}
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
        <div class="field-label" style="margin-bottom:12px">{t('common.result')}</div>
        <div class="readout conv-readout">
          {result === null ? '—' : fmt(result)}
          <span class="conv-unit">{t(`unit.${to}` as MessageKey).toLowerCase()}</span>
        </div>
      </div>
      <Button variant="primary" icon={Copy} onclick={() => result !== null && copy(fmt(result))}>
        {t('common.copyResult')}
      </Button>
    </div>
  </div>
{/if}
