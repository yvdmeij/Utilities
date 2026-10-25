<script lang="ts">
  import { ArrowLeft, Copy } from 'lucide-svelte';
  import Button from '../components/Button.svelte';
  import Segmented from '../components/Segmented.svelte';
  import Output from '../components/glass/Output.svelte';
  import Seg from '../components/glass/Seg.svelte';
  import ToolPage from '../components/glass/ToolPage.svelte';
  import { design } from '../design.svelte';
  import { t } from '../i18n.svelte';
  import { copy } from '../toast';

  let { onBack }: { onBack: () => void } = $props();

  const transforms = [
    { id: 'upper', label: 'case.upper' as const, fn: (s: string) => s.toUpperCase() },
    { id: 'lower', label: 'case.lower' as const, fn: (s: string) => s.toLowerCase() },
    {
      id: 'title',
      label: 'case.titleCase' as const,
      fn: (s: string) => s.replace(/\p{L}\S*/gu, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
    },
    {
      id: 'sentence',
      label: 'case.sentence' as const,
      fn: (s: string) => s.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (c) => c.toUpperCase()),
    },
  ];

  let text = $state('');
  let mode = $state('upper');

  const out = $derived((transforms.find((tr) => tr.id === mode) ?? transforms[0]).fn(text));
</script>

{#if design.current === 'glass'}
  <ToolPage {onBack} eyebrow={t('eyebrow.transform')} title={t('case.title')}>
    <div class="qk-card">
      <Seg
        options={transforms.map((tr) => ({ value: tr.id, label: t(tr.label) }))}
        value={mode}
        onChange={(m) => (mode = m)}
      />
      <label class="qk-field">
        <span class="qk-label">{t('case.input')}</span>
        <textarea class="qk-textarea" bind:value={text} placeholder={t('case.inputPh')}></textarea>
      </label>
      <div class="qk-field">
        <span class="qk-label">{t('case.output')}</span>
        <Output value={text ? out : ''} empty={t('case.outputPh')} />
      </div>
    </div>
  </ToolPage>
{:else}

  <div class="content-inner fade-up">
    <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> {t('menu.allTools')}</button>
    <div class="page-head">
      <div class="eyebrow">{t('eyebrow.transform')}</div>
      <h1 class="page-title"><b>{t('case.title')}</b></h1>
    </div>

    <div class="panel">
      <div style="margin-bottom:22px">
        <Segmented
          options={transforms.map((tr) => ({ value: tr.id, label: t(tr.label) }))}
          value={mode}
          onChange={(m) => (mode = m)}
        />
      </div>
      <div class="grid-2">
        <div class="field bare-field">
          <span class="field-label">{t('case.input')}</span>
          <textarea class="textarea" bind:value={text} placeholder={t('case.inputPh')}></textarea>
        </div>
        <div class="field bare-field">
          <span class="field-label">{t('case.output')}</span>
          <textarea class="textarea" value={out} readonly placeholder={t('case.outputPh')}></textarea>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:18px">
        <Button variant="primary" icon={Copy} onclick={() => copy(out)}>{t('common.copyResult')}</Button>
      </div>
    </div>
  </div>
{/if}
