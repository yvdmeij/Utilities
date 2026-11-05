<script lang="ts">
  import { ArrowLeft, Copy } from 'lucide-svelte';
  import Button from '../components/Button.svelte';
  import Output from '../components/glass/Output.svelte';
  import ToolPage from '../components/glass/ToolPage.svelte';
  import { design } from '../design.svelte';
  import { htmlToMarkdown } from '../htmlToMarkdown';
  import { t } from '../i18n.svelte';
  import { copy } from '../toast';

  let { onBack }: { onBack: () => void } = $props();

  let html = $state('');
  const out = $derived(html.trim() ? htmlToMarkdown(html) : '');
</script>

{#if design.current === 'glass'}
  <ToolPage {onBack} eyebrow={t('eyebrow.convert')} title={t('html2md.title')}>
    <div class="qk-card">
      <label class="qk-field">
        <span class="qk-label">HTML</span>
        <textarea class="qk-textarea" bind:value={html} placeholder={t('html2md.paste')}></textarea>
      </label>
      <div class="qk-field">
        <span class="qk-label">Markdown</span>
        <Output value={out} empty={t('case.outputPh')} />
      </div>
    </div>
  </ToolPage>
{:else}
  <div class="content-inner fade-up">
    <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> {t('menu.allTools')}</button>
    <div class="page-head">
      <div class="eyebrow">{t('eyebrow.convert')}</div>
      <h1 class="page-title"><b>{t('html2md.title')}</b></h1>
    </div>

    <div class="panel">
      <div class="grid-2">
        <div class="field bare-field">
          <span class="field-label">HTML</span>
          <textarea
            class="textarea input-mono bare"
            bind:value={html}
            placeholder={t('html2md.paste')}
          ></textarea>
        </div>
        <div class="field bare-field">
          <span class="field-label">Markdown</span>
          <textarea
            class="textarea input-mono bare"
            value={out}
            readonly
            placeholder={t('common.result')}
          ></textarea>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:18px">
        <Button variant="primary" icon={Copy} onclick={() => out && copy(out)}
          >{t('common.copyResult')}</Button
        >
      </div>
    </div>
  </div>
{/if}
