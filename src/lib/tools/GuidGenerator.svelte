<script lang="ts">
  import { ArrowLeft, Check, Copy, RefreshCw } from 'lucide-svelte';
  import Button from '../components/Button.svelte';
  import Segmented from '../components/Segmented.svelte';
  import Seg from '../components/glass/Seg.svelte';
  import ToolPage from '../components/glass/ToolPage.svelte';
  import { design } from '../design.svelte';
  import { t } from '../i18n.svelte';
  import { copy } from '../toast';

  let { onBack }: { onBack: () => void } = $props();

  function uuidv4(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const h = [...b].map((x) => x.toString(16).padStart(2, '0'));
    return `${h[0]}${h[1]}${h[2]}${h[3]}-${h[4]}${h[5]}-${h[6]}${h[7]}-${h[8]}${h[9]}-${h[10]}${h[11]}${h[12]}${h[13]}${h[14]}${h[15]}`;
  }

  const gen = (n: number) => Array.from({ length: n }, uuidv4);

  let count = $state(5);
  let upper = $state(false);
  let hyphens = $state(true);
  let raw = $state<string[]>(gen(5));

  const formatted = $derived(
    raw.map((id) => {
      let s = hyphens ? id : id.replace(/-/g, '');
      return upper ? s.toUpperCase() : s;
    }),
  );
  const text = $derived(formatted.join('\n'));

  function regenerate() {
    raw = gen(count);
  }
  function pick(n: number) {
    count = n;
    raw = gen(n);
  }
</script>

{#if design.current === 'glass'}
  <ToolPage {onBack} eyebrow={t('eyebrow.generate')} title={t('guid.title')}>
    <div class="qk-card">
      <div class="qk-row-between" style="align-items:flex-end">
        <div class="qk-field">
          <span class="qk-label">{t('guid.howMany')}</span>
          <Seg
            options={[1, 5, 10, 25].map((n) => ({ value: n, label: String(n) }))}
            value={count}
            onChange={pick}
          />
        </div>
        <div class="qk-field">
          <span class="qk-label">{t('guid.format')}</span>
          <div class="qk-actions" style="gap:6px">
            <button class="qk-chip {upper ? 'on' : ''}" aria-pressed={upper} onclick={() => (upper = !upper)}>
              {#if upper}<Check size={13} strokeWidth={2.2} />{/if}{t('guid.uppercase')}
            </button>
            <button class="qk-chip {hyphens ? 'on' : ''}" aria-pressed={hyphens} onclick={() => (hyphens = !hyphens)}>
              {#if hyphens}<Check size={13} strokeWidth={2.2} />{/if}{t('guid.hyphens')}
            </button>
          </div>
        </div>
      </div>
      <div class="qk-actions">
        <button class="qk-btn qk-btn-secondary" onclick={regenerate}>
          <RefreshCw size={16} strokeWidth={1.75} />{t('guid.regenerate')}
        </button>
        <button class="qk-btn qk-btn-primary" onclick={() => text && copy(text)}>
          <Copy size={16} strokeWidth={1.75} />{t('guid.copyAll')}
        </button>
      </div>
    </div>
    <div class="qk-card">
      <div class="qk-card-head">
        <span class="qk-label">{count === 1 ? t('common.result') : t('guid.count', { n: count })}</span>
        <span class="qk-meta">{t('guid.clickToCopy')}</span>
      </div>
      <div class="qk-guids">
        {#each formatted as g, i (i)}
          <button class="qk-guid" onclick={() => copy(g)}>{g}</button>
        {/each}
      </div>
    </div>
  </ToolPage>
{:else}

  <div class="content-inner fade-up">
    <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> {t('menu.allTools')}</button>
    <div class="page-head">
      <div class="eyebrow">{t('eyebrow.generate')}</div>
      <h1 class="page-title"><b>{t('guid.title')}</b></h1>
    </div>

    <div class="panel">
      <div style="margin-bottom:26px">
        <div class="field-label" style="margin-bottom:11px">{t('guid.howMany')}</div>
        <Segmented
          options={[
            { value: 1, label: '1' },
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 25, label: '25' },
          ]}
          value={count}
          onChange={pick}
        />
      </div>

      <div
        style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-bottom:30px"
      >
        <div>
          <div class="field-label" style="margin-bottom:11px">{t('guid.format')}</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <Button variant={upper ? 'primary' : 'ghost'} onclick={() => (upper = !upper)}>
              {t('guid.uppercase')}
            </Button>
            <Button variant={hyphens ? 'primary' : 'ghost'} onclick={() => (hyphens = !hyphens)}>
              {t('guid.hyphens')}
            </Button>
          </div>
        </div>
        <div style="display:flex;gap:10px">
          <Button variant="secondary" icon={RefreshCw} onclick={regenerate}>{t('guid.regenerate')}</Button>
          <Button variant="primary" icon={Copy} onclick={() => text && copy(text)}>{t('guid.copyAll')}</Button>
        </div>
      </div>

      <div class="field-label" style="margin-bottom:13px">{count === 1 ? t('common.result') : t('guid.count', { n: count })}</div>
      <div class="guid-list">
        {#each formatted as g, i (i)}
          <button class="guid-line" onclick={() => copy(g)} title={t('guid.clickToCopy')}>{g}</button>
        {/each}
      </div>
    </div>
  </div>
{/if}
