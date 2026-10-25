<script lang="ts">
  import {
    ArrowLeft,
    ArrowLeftRight,
    CloudOff,
    Copy,
    Plus,
    RefreshCw,
    Star,
    X,
  } from 'lucide-svelte';
  import { untrack } from 'svelte';
  import Button from '../components/Button.svelte';
  import { CURRENCIES, CURRENCY_SIGNS, fetchRates, type RateData } from '../currency';
  import { i18n, LANG_CONFIG, locale, type MessageKey, t } from '../i18n.svelte';
  import { copy, toast } from '../toast';

  const CACHE_KEY = 'quietkit:currency';
  const ROWS_KEY = 'quietkit:currency:rows';
  const FAVORITES_KEY = 'quietkit:currency:favorites';
  const SOURCE_LINKS: Record<string, string> = {
    erapi: 'https://www.exchangerate-api.com',
  };

  function readFavorites(): string[] {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list)
        ? list.filter((c) => typeof c === 'string' && c in CURRENCIES)
        : [];
    } catch {
      return [];
    }
  }

  function writeFavorites(list: string[]) {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
    } catch {
      // Ignore storage failures (private mode, quota) — favorites just won't persist.
    }
  }

  let { onBack }: { onBack: () => void } = $props();

  interface ConvRow {
    id: string;
    amount: string;
    from: string;
    to: string;
  }

  function readRows(): ConvRow[] {
    try {
      const raw = localStorage.getItem(ROWS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) return [];
      return list
        .filter(
          (r) =>
            r &&
            typeof r.id === 'string' &&
            typeof r.amount === 'string' &&
            r.from in CURRENCIES &&
            r.to in CURRENCIES
        )
        .map((r) => ({ id: r.id, amount: r.amount, from: r.from, to: r.to }));
    } catch {
      return [];
    }
  }

  function writeRows(list: ConvRow[]) {
    try {
      localStorage.setItem(ROWS_KEY, JSON.stringify(list));
    } catch {
      // Ignore storage failures (private mode, quota) — extra rows just won't persist.
    }
  }

  // The active language decides the rate source and which currency leads the list.
  const config = $derived(LANG_CONFIG[i18n.lang]);

  let amount = $state('1');
  let from = $state(LANG_CONFIG[i18n.lang].baseCurrency);
  let to = $state(LANG_CONFIG[i18n.lang].secondCurrency);
  let rates = $state<Record<string, number> | null>(null);
  let rateDate = $state('');
  let status = $state<'loading' | 'ready' | 'error'>('loading');
  let refreshing = $state(false);
  let rows = $state<ConvRow[]>(readRows());
  let favorites = $state<string[]>(readFavorites());

  // Selectable currencies: only those the active source has a rate for, with the
  // language's base currency first and the rest alphabetical.
  const codes = $derived(
    Object.keys(CURRENCIES)
      .filter((c) => !rates || c in rates)
      .sort((a, b) =>
        a === config.baseCurrency ? -1 : b === config.baseCurrency ? 1 : a.localeCompare(b)
      )
  );

  const shownFavorites = $derived(favorites.filter((c) => codes.includes(c)));

  const displayNames = $derived.by(() => {
    try {
      return new Intl.DisplayNames([locale()], { type: 'currency' });
    } catch {
      return null;
    }
  });
  const currencyName = (c: string) => displayNames?.of(c) ?? CURRENCIES[c];

  $effect(() => {
    writeRows(rows);
  });

  $effect(() => {
    writeFavorites(favorites);
  });

  function toggleFavorite(code: string) {
    favorites = favorites.includes(code)
      ? favorites.filter((c) => c !== code)
      : [...favorites, code];
  }

  function addRow() {
    rows = [
      ...rows,
      {
        id: crypto.randomUUID(),
        amount: '1',
        from: config.baseCurrency,
        to: config.secondCurrency,
      },
    ];
  }

  function removeRow(id: string) {
    rows = rows.filter((r) => r.id !== id);
  }

  function swapRow(row: ConvRow) {
    [row.from, row.to] = [row.to, row.from];
  }

  // Local YYYY-MM-DD so the cache turns over once per calendar day.
  function today(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  // Each source has its own cache entry, so switching language never mixes base currencies.
  function readCache(source: string): ({ date: string } & RateData) | null {
    try {
      const raw = localStorage.getItem(`${CACHE_KEY}:${source}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // Apply fetched rates, unless the language (and so the source) changed meanwhile.
  function applyRates(source: string, data: RateData): boolean {
    if (source !== config.source) return false;
    rates = data.rates;
    rateDate = data.rateDate;
    status = 'ready';
    // A saved selection may not exist in this source (e.g. a dropped currency).
    if (!(from in data.rates)) from = config.baseCurrency;
    if (!(to in data.rates)) to = config.secondCurrency;
    for (const r of rows) {
      if (!(r.from in data.rates)) r.from = config.baseCurrency;
      if (!(r.to in data.rates)) r.to = config.secondCurrency;
    }
    return true;
  }

  async function fetchAndCache(source: typeof config.source, fresh = false): Promise<void> {
    const data = await fetchRates(source, fresh);
    if (!applyRates(source, data)) return;
    try {
      localStorage.setItem(`${CACHE_KEY}:${source}`, JSON.stringify({ date: today(), ...data }));
    } catch {
      // Ignore storage failures (private mode, quota) — rates still work this session.
    }
  }

  async function loadRates() {
    const source = config.source;
    const cached = readCache(source);

    // Show whatever we have cached straight away — even if it's from a previous
    // day — so the app is usable immediately. This matters most for the iOS
    // home-screen app, which cold-starts after disuse: blocking on a fresh
    // network round-trip there can take several seconds, while a day-old rate is
    // perfectly fine to show meanwhile.
    if (cached) {
      applyRates(source, cached);
      // Fresh for today — nothing to revalidate, skip the network entirely.
      if (cached.date === today()) return;
    } else {
      rates = null;
      status = 'loading';
    }

    try {
      await fetchAndCache(source);
    } catch {
      // Network failed or timed out. If we already showed cached rates above,
      // just keep them; otherwise there's nothing to display.
      if (source === config.source) status = cached ? 'ready' : 'error';
    }
  }

  // Manual refresh: keeps the current rates on screen while fetching, and only
  // swaps them in once the new ones arrive.
  async function refreshRates() {
    if (refreshing) return;
    refreshing = true;
    const previousDate = rateDate;
    try {
      await fetchAndCache(config.source, true);
      toast(
        rateDate === previousDate ? t('currency.latest', { date: rateDate }) : t('currency.updated')
      );
    } catch {
      toast(t('currency.refreshFailed'), CloudOff);
    } finally {
      refreshing = false;
    }
  }

  // Runs on mount and whenever the language changes: reset to that language's
  // currencies and load rates from its source.
  $effect(() => {
    const c = config;
    untrack(() => {
      from = c.baseCurrency;
      to = c.secondCurrency;
      loadRates();
    });
  });

  function convert(amountStr: string, fromCode: string, toCode: string): number | null {
    if (!rates) return null;
    const f = rates[fromCode];
    const tr = rates[toCode];
    // Accept a decimal comma, as typed on Norwegian and Dutch keyboards.
    const n = Number.parseFloat(amountStr.replace(',', '.'));
    if (Number.isNaN(n) || f === undefined || tr === undefined) return null;
    return (n * tr) / f;
  }

  const result = $derived.by(() => convert(amount, from, to));

  const fmt = (x: number) =>
    x.toLocaleString(locale(), { minimumFractionDigits: 2, maximumFractionDigits: 4 });

  function swap() {
    [from, to] = [to, from];
  }
</script>

<div class="content-inner fade-up">
  <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> {t('menu.allTools')}</button>
  <div class="page-head">
    <div class="eyebrow">{t('eyebrow.convert')}</div>
    <h1 class="page-title"><b>{t('currency.title')}</b></h1>
  </div>

  {#snippet currencyOptions()}
    {#if shownFavorites.length}
      <optgroup label={t('currency.favorites')}>
        {#each shownFavorites as c (c)}
          <option value={c}>{c} ({CURRENCY_SIGNS[c]}) — {currencyName(c)}</option>
        {/each}
      </optgroup>
      <optgroup label={t('currency.all')}>
        {#each codes.filter((c) => !shownFavorites.includes(c)) as c (c)}
          <option value={c}>{c} ({CURRENCY_SIGNS[c]}) — {currencyName(c)}</option>
        {/each}
      </optgroup>
    {:else}
      {#each codes as c (c)}
        <option value={c}>{c} ({CURRENCY_SIGNS[c]}) — {currencyName(c)}</option>
      {/each}
    {/if}
  {/snippet}

  <div class="panel">
    <div class="swap-row">
      <div class="field" style="flex:1">
        <span class="field-label">{t('common.from')}</span>
        <div class="unit-field">
          <input
            value={amount}
            inputmode="decimal"
            oninput={(e) => (amount = e.currentTarget.value)}
          />
          <select class="unit-select" bind:value={from}>
            {@render currencyOptions()}
          </select>
          <button
            class="fav-toggle {favorites.includes(from) ? 'active' : ''}"
            onclick={() => toggleFavorite(from)}
            title={favorites.includes(from)
              ? t('currency.removeFavorite')
              : t('currency.addFavorite')}
            aria-label={t('currency.toggleFavorite')}
          >
            <Star size={15} fill={favorites.includes(from) ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      <button class="swap-btn" onclick={swap} title={t('common.swap')}
        ><ArrowLeftRight size={17} /></button
      >
      <div class="field" style="flex:1">
        <span class="field-label">{t('common.to')}</span>
        <div class="unit-field">
          <input value={result === null ? '' : fmt(result)} readonly />
          <select class="unit-select" bind:value={to}>
            {@render currencyOptions()}
          </select>
          <button
            class="fav-toggle {favorites.includes(to) ? 'active' : ''}"
            onclick={() => toggleFavorite(to)}
            title={favorites.includes(to)
              ? t('currency.removeFavorite')
              : t('currency.addFavorite')}
            aria-label={t('currency.toggleFavorite')}
          >
            <Star size={15} fill={favorites.includes(to) ? 'currentColor' : 'none'} />
          </button>
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
      {#if status === 'loading'}
        <div class="readout conv-readout" style="color:var(--ink-2)">{t('currency.fetching')}</div>
      {:else if status === 'error'}
        <div class="readout conv-readout" style="color:var(--ink-2)">
          {t('currency.unavailable')}
        </div>
      {:else}
        <div class="readout conv-readout">
          {result === null ? '—' : fmt(result)}
          <span class="conv-unit">{to}</span>
        </div>
        <div class="rate-meta field-label">
          {#if SOURCE_LINKS[config.source]}
            <a href={SOURCE_LINKS[config.source]} target="_blank" rel="noopener"
              >{t(
                `currency.source${config.source[0].toUpperCase()}${config.source.slice(1)}` as MessageKey
              )}</a
            >
          {:else}
            {t(
              `currency.source${config.source[0].toUpperCase()}${config.source.slice(1)}` as MessageKey
            )}
          {/if}
          · {rateDate}
          <button
            class="rate-refresh {refreshing ? 'spinning' : ''}"
            onclick={refreshRates}
            disabled={refreshing}
            title={refreshing ? t('currency.refreshing') : t('currency.refresh')}
            aria-label={t('currency.refresh')}
          >
            <RefreshCw size={13} />
          </button>
        </div>
      {/if}
    </div>
    {#if status === 'error'}
      <Button variant="secondary" icon={RefreshCw} onclick={loadRates}>{t('currency.retry')}</Button
      >
    {:else}
      <Button
        variant="primary"
        icon={Copy}
        disabled={result === null}
        onclick={() => result !== null && copy(fmt(result))}
      >
        {t('common.copyResult')}
      </Button>
    {/if}
  </div>

  <div class="panel">
    <div class="field-label" style="margin-bottom:14px">{t('currency.other')}</div>
    {#if rows.length}
      <div class="conv-rows">
        {#each rows as row (row.id)}
          {@const amt = convert(row.amount, row.from, row.to)}
          <div class="conv-row">
            <div class="swap-row conv-row-fields">
              <div class="field" style="flex:1">
                <div class="unit-field">
                  <input
                    value={row.amount}
                    inputmode="decimal"
                    oninput={(e) => (row.amount = e.currentTarget.value)}
                  />
                  <select class="unit-select" bind:value={row.from}>
                    {@render currencyOptions()}
                  </select>
                </div>
              </div>
              <button
                class="swap-btn swap-btn-sm"
                onclick={() => swapRow(row)}
                title={t('common.swap')}
              >
                <ArrowLeftRight size={15} />
              </button>
              <div class="field" style="flex:1">
                <div class="unit-field">
                  <input value={amt === null ? '' : fmt(amt)} readonly />
                  <select class="unit-select" bind:value={row.to}>
                    {@render currencyOptions()}
                  </select>
                </div>
              </div>
            </div>
            <button
              class="row-remove"
              onclick={() => removeRow(row.id)}
              title={t('currency.remove')}
              aria-label={t('currency.remove')}
            >
              <X size={16} />
            </button>
          </div>
        {/each}
      </div>
    {/if}
    <Button variant="secondary" icon={Plus} onclick={addRow}>{t('currency.add')}</Button>
  </div>
</div>
