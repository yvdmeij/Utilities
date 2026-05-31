<script lang="ts">
  import { ArrowLeft, Copy } from 'lucide-svelte';
  import Button from '../components/Button.svelte';
  import Segmented from '../components/Segmented.svelte';
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
      return text ? 'Not valid Base64' : '';
    }
  });
</script>

<div class="content-inner fade-up">
  <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> All tools</button>
  <div class="page-head">
    <div class="eyebrow">Encode</div>
    <h1 class="page-title"><b>Base64</b></h1>
  </div>

  <div class="panel">
    <div style="margin-bottom:22px">
      <Segmented
        options={[
          { value: 'encode', label: 'Encode' },
          { value: 'decode', label: 'Decode' },
        ]}
        value={mode}
        onChange={(m) => (mode = m)}
      />
    </div>
    <div class="grid-2">
      <div class="field">
        <span class="field-label">{mode === 'encode' ? 'Plain text' : 'Base64'}</span>
        <textarea class="textarea input-mono" bind:value={text} placeholder="Paste here…"></textarea>
      </div>
      <div class="field">
        <span class="field-label">{mode === 'encode' ? 'Base64' : 'Plain text'}</span>
        <textarea class="textarea input-mono" value={out} readonly placeholder="Result"></textarea>
      </div>
    </div>
    <div style="display:flex;justify-content:flex-end;margin-top:18px">
      <Button variant="primary" icon={Copy} onclick={() => out && copy(out)}>Copy result</Button>
    </div>
  </div>
</div>
