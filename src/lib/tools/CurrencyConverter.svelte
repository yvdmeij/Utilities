<script lang="ts">
  import { ArrowLeft, ArrowLeftRight, Copy, Plus, RefreshCw, Star, X } from 'lucide-svelte';
  import Button from '../components/Button.svelte';
  import { copy } from '../toast';

  // The ~31 currencies published by the Frankfurter / ECB feed. Names and signs are
  // hardcoded so the dropdown reads nicely without a second network request.
  const CURRENCIES: Record<string, string> = {
    AUD: 'Australian Dollar',
    BGN: 'Bulgarian Lev',
    BRL: 'Brazilian Real',
    CAD: 'Canadian Dollar',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    CZK: 'Czech Koruna',
    DKK: 'Danish Krone',
    EUR: 'Euro',
    GBP: 'British Pound',
    HKD: 'Hong Kong Dollar',
    HUF: 'Hungarian Forint',
    IDR: 'Indonesian Rupiah',
    ILS: 'Israeli Shekel',
    INR: 'Indian Rupee',
    ISK: 'Icelandic Króna',
    JPY: 'Japanese Yen',
    KRW: 'South Korean Won',
    MXN: 'Mexican Peso',
    MYR: 'Malaysian Ringgit',
    NOK: 'Norwegian Krone',
    NZD: 'New Zealand Dollar',
    PHP: 'Philippine Peso',
    PLN: 'Polish Złoty',
    RON: 'Romanian Leu',
    SEK: 'Swedish Krona',
    SGD: 'Singapore Dollar',
    THB: 'Thai Baht',
    TRY: 'Turkish Lira',
    USD: 'US Dollar',
    ZAR: 'South African Rand',
  };

  const CURRENCY_SIGNS: Record<string, string> = {
    AUD: 'A$',
    BGN: 'лв',
    BRL: 'R$',
    CAD: 'C$',
    CHF: 'CHF',
    CNY: '¥',
    CZK: 'Kč',
    DKK: 'kr',
    EUR: '€',
    GBP: '£',
    HKD: 'HK$',
    HUF: 'Ft',
    IDR: 'Rp',
    ILS: '₪',
    INR: '₹',
    ISK: 'kr',
    JPY: '¥',
    KRW: '₩',
    MXN: '$',
    MYR: 'RM',
    NOK: 'kr',
    NZD: 'NZ$',
    PHP: '₱',
    PLN: 'zł',
    RON: 'lei',
    SEK: 'kr',
    SGD: 'S$',
    THB: '฿',
    TRY: '₺',
    USD: '$',
    ZAR: 'R',
  };

  const CACHE_KEY = 'quietkit:currency';
  const ROWS_KEY = 'quietkit:currency:rows';
  const FAVORITES_KEY = 'quietkit:currency:favorites';
  const codes = Object.keys(CURRENCIES);

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

  let amount = $state('1');
  let from = $state('USD');
  let to = $state('EUR');
  let rates = $state<Record<string, number> | null>(null);
  let rateDate = $state('');
  let status = $state<'loading' | 'ready' | 'error'>('loading');
  let rows = $state<ConvRow[]>(readRows());
  let favorites = $state<string[]>(readFavorites());

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
    rows = [...rows, { id: crypto.randomUUID(), amount: '1', from: 'USD', to: 'EUR' }];
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

  function readCache(): { date: string; rateDate: string; rates: Record<string, number> } | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  async function loadRates() {
    status = 'loading';
    const cached = readCache();

    // Fresh cache for today — use it without hitting the network.
    if (cached && cached.date === today()) {
      rates = cached.rates;
      rateDate = cached.rateDate;
      status = 'ready';
      return;
    }

    try {
      const res = await fetch('https://api.frankfurter.dev/v1/latest?base=EUR');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const map = { EUR: 1, ...data.rates } as Record<string, number>;
      rates = map;
      rateDate = data.date;
      status = 'ready';
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ date: today(), rateDate: data.date, rates: map })
        );
      } catch {
        // Ignore storage failures (private mode, quota) — rates still work this session.
      }
    } catch {
      // Network failed: fall back to a stale cache if we have one.
      if (cached) {
        rates = cached.rates;
        rateDate = cached.rateDate;
        status = 'ready';
      } else {
        status = 'error';
      }
    }
  }

  $effect(() => {
    loadRates();
  });

  function convert(amountStr: string, fromCode: string, toCode: string): number | null {
    if (!rates) return null;
    const f = rates[fromCode];
    const t = rates[toCode];
    const n = Number.parseFloat(amountStr);
    if (Number.isNaN(n) || f === undefined || t === undefined) return null;
    return (n * t) / f;
  }

  const result = $derived.by(() => convert(amount, from, to));

  const fmt = (x: number) =>
    x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });

  function swap() {
    [from, to] = [to, from];
  }
</script>

<div class="content-inner fade-up">
  <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> All tools</button>
  <div class="page-head">
    <div class="eyebrow">Convert</div>
    <h1 class="page-title"><b>Currency converter</b></h1>
  </div>

  {#snippet currencyOptions()}
    {#if favorites.length}
      <optgroup label="Favorites">
        {#each favorites as c (c)}
          <option value={c}>{c} ({CURRENCY_SIGNS[c]}) — {CURRENCIES[c]}</option>
        {/each}
      </optgroup>
      <optgroup label="All currencies">
        {#each codes.filter((c) => !favorites.includes(c)) as c (c)}
          <option value={c}>{c} ({CURRENCY_SIGNS[c]}) — {CURRENCIES[c]}</option>
        {/each}
      </optgroup>
    {:else}
      {#each codes as c (c)}
        <option value={c}>{c} ({CURRENCY_SIGNS[c]}) — {CURRENCIES[c]}</option>
      {/each}
    {/if}
  {/snippet}

  <div class="panel">
    <div class="swap-row">
      <div class="field" style="flex:1">
        <span class="field-label">From</span>
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
            title={favorites.includes(from) ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Star size={15} fill={favorites.includes(from) ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      <button class="swap-btn" onclick={swap} title="Swap"><ArrowLeftRight size={17} /></button>
      <div class="field" style="flex:1">
        <span class="field-label">To</span>
        <div class="unit-field">
          <input value={result === null ? '' : fmt(result)} readonly />
          <select class="unit-select" bind:value={to}>
            {@render currencyOptions()}
          </select>
          <button
            class="fav-toggle {favorites.includes(to) ? 'active' : ''}"
            onclick={() => toggleFavorite(to)}
            title={favorites.includes(to) ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
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
      <div class="field-label" style="margin-bottom:12px">Result</div>
      {#if status === 'loading'}
        <div class="readout conv-readout" style="color:var(--ink-2)">Fetching latest rates…</div>
      {:else if status === 'error'}
        <div class="readout conv-readout" style="color:var(--ink-2)">Rates unavailable</div>
      {:else}
        <div class="readout conv-readout">
          {result === null ? '—' : fmt(result)}
          <span class="conv-unit">{to}</span>
        </div>
        <div class="field-label" style="margin-top:10px;font-weight:500">
          Updated · {rateDate}
        </div>
      {/if}
    </div>
    {#if status === 'error'}
      <Button variant="secondary" icon={RefreshCw} onclick={loadRates}>Retry</Button>
    {:else}
      <Button
        variant="primary"
        icon={Copy}
        disabled={result === null}
        onclick={() => result !== null && copy(fmt(result))}
      >
        Copy result
      </Button>
    {/if}
  </div>

  <div class="panel">
    <div class="field-label" style="margin-bottom:14px">Other conversions</div>
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
              <button class="swap-btn swap-btn-sm" onclick={() => swapRow(row)} title="Swap">
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
              title="Remove conversion"
              aria-label="Remove conversion"
            >
              <X size={16} />
            </button>
          </div>
        {/each}
      </div>
    {/if}
    <Button variant="secondary" icon={Plus} onclick={addRow}>Add conversion</Button>
  </div>
</div>
