<script lang="ts">
  import { ArrowLeft, Clock, Copy, Eraser, X } from 'lucide-svelte';
  import Button from '../components/Button.svelte';
  import ToolPage from '../components/glass/ToolPage.svelte';
  import { design } from '../design.svelte';
  import { locale, t } from '../i18n.svelte';
  import { copy } from '../toast';

  let { onBack }: { onBack: () => void } = $props();

  let text = $state('');

  const words = $derived(text.trim() ? text.trim().split(/\s+/).length : 0);
  const chars = $derived(text.length);
  const noSpace = $derived(text.replace(/\s/g, '').length);
  const sentences = $derived(text.trim() ? (text.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0);
  const readMin = $derived(Math.max(words ? 1 : 0, Math.round(words / 200)));

  const stats = $derived([
    { n: words.toLocaleString(locale()), l: t('counter.words') },
    { n: chars.toLocaleString(locale()), l: t('counter.characters') },
    { n: noSpace.toLocaleString(locale()), l: t('counter.noSpaces') },
    { n: sentences.toLocaleString(locale()), l: t('counter.sentences') },
  ]);
</script>

{#if design.current === 'glass'}
  <ToolPage {onBack} eyebrow={t('eyebrow.write')} title={t('counter.title')}>
    <div class="qk-stats">
      {#each stats as s (s.l)}
        <div class="qk-stat"><span class="qk-stat-n">{s.n}</span><span class="qk-label">{s.l}</span></div>
      {/each}
    </div>
    <div class="qk-card">
      <label class="qk-field">
        <span class="qk-label">{t('counter.yourText')}</span>
        <textarea
          class="qk-textarea"
          style="min-height:220px"
          bind:value={text}
          placeholder={t('counter.placeholder')}
        ></textarea>
      </label>
      <div class="qk-row-between">
        <div class="qk-actions">
          <button class="qk-btn qk-btn-secondary" disabled={!text} onclick={() => (text = '')}>
            <X size={16} strokeWidth={1.75} />{t('counter.clear')}
          </button>
          <button class="qk-btn qk-btn-primary" disabled={!text} onclick={() => copy(text)}>
            <Copy size={16} strokeWidth={1.75} />{t('common.copyText')}
          </button>
        </div>
        <span class="qk-meta qk-inline"><Clock size={13} strokeWidth={1.75} />{t('counter.readTime', { n: readMin })}</span>
      </div>
    </div>
  </ToolPage>
{:else}

  <div class="content-inner fade-up">
    <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> {t('menu.allTools')}</button>
    <div class="page-head">
      <div class="eyebrow">{t('eyebrow.write')}</div>
      <h1 class="page-title"><b>{t('counter.title')}</b></h1>
    </div>

    <div class="panel">
      <div class="stat-grid" style="margin-bottom:24px">
        {#each stats as s (s.l)}
          <div class="stat"><div class="stat-num">{s.n}</div><div class="stat-label">{s.l}</div></div>
        {/each}
      </div>
      <div class="field bare-field">
        <span class="field-label">{t('counter.yourText')}</span>
        <textarea
          class="textarea"
          bind:value={text}
          placeholder={t('counter.placeholder')}
        ></textarea>
      </div>
      <div
        style="display:flex;align-items:center;justify-content:space-between;margin-top:18px;flex-wrap:wrap;gap:12px"
      >
        <span class="ds-body-sm muted" style="display:inline-flex;align-items:center;gap:6px">
          <Clock size={14} /> {t('counter.readTime', { n: readMin })}
        </span>
        <div style="display:flex;gap:10px">
          <Button variant="ghost" icon={Eraser} onclick={() => (text = '')}>{t('counter.clear')}</Button>
          <Button variant="primary" icon={Copy} onclick={() => copy(text)}>{t('common.copyText')}</Button>
        </div>
      </div>
    </div>
  </div>
{/if}
