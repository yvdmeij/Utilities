<script lang="ts">
  import { ArrowLeft, Copy } from 'lucide-svelte';
  import Button from '../components/Button.svelte';
  import Segmented from '../components/Segmented.svelte';
  import { t } from '../i18n.svelte';
  import { copy } from '../toast';

  let { onBack }: { onBack: () => void } = $props();

  let mode = $state('encode');
  let text = $state('');

  const out = $derived.by(() => {
    try {
      return mode === 'encode'
        ? btoa(unescape(encodeURIComponent(text)))
        : decodeURIComponent(escape(atob(text)));
    } catch {
      return text ? t('base64.invalid') : '';
    }
  });
</script>

<div class="content-inner fade-up">
  <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> {t('menu.allTools')}</button>
  <div class="page-head">
    <div class="eyebrow">{t('eyebrow.encode')}</div>
    <h1 class="page-title"><b>{t('base64.title')}</b></h1>
  </div>

  <div class="panel">
    <div style="margin-bottom:22px">
      <Segmented
        options={[
          { value: 'encode', label: t('base64.encode') },
          { value: 'decode', label: t('base64.decode') },
        ]}
        value={mode}
        onChange={(m) => (mode = m)}
      />
    </div>
    <div class="grid-2">
      <div class="field bare-field">
        <span class="field-label">{mode === 'encode' ? t('base64.plain') : 'Base64'}</span>
        <textarea class="textarea input-mono bare" bind:value={text} placeholder={t('base64.paste')}
        ></textarea>
      </div>
      <div class="field bare-field">
        <span class="field-label">{mode === 'encode' ? 'Base64' : t('base64.plain')}</span>
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
