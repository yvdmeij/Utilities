<script lang="ts">
  import { ArrowLeft, Copy } from 'lucide-svelte';
  import Button from '../components/Button.svelte';
  import Segmented from '../components/Segmented.svelte';
  import { copy } from '../toast';

  let { onBack }: { onBack: () => void } = $props();

  const transforms = [
    { id: 'upper', label: 'UPPER', fn: (s: string) => s.toUpperCase() },
    { id: 'lower', label: 'lower', fn: (s: string) => s.toLowerCase() },
    {
      id: 'title',
      label: 'Title',
      fn: (s: string) => s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
    },
    {
      id: 'sentence',
      label: 'Sentence',
      fn: (s: string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
    },
  ];

  let text = $state('');
  let mode = $state('upper');

  const out = $derived((transforms.find((t) => t.id === mode) ?? transforms[0]).fn(text));
</script>

<div class="content-inner fade-up">
  <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> All tools</button>
  <div class="page-head">
    <div class="eyebrow">Transform</div>
    <h1 class="page-title"><b>Case converter</b></h1>
  </div>

  <div class="panel">
    <div style="margin-bottom:22px">
      <Segmented
        options={transforms.map((t) => ({ value: t.id, label: t.label }))}
        value={mode}
        onChange={(m) => (mode = m)}
      />
    </div>
    <div class="grid-2">
      <div class="field">
        <span class="field-label">Input</span>
        <textarea class="textarea" bind:value={text} placeholder="Type something…"></textarea>
      </div>
      <div class="field">
        <span class="field-label">Output</span>
        <textarea class="textarea" value={out} readonly placeholder="Result appears here"></textarea>
      </div>
    </div>
    <div style="display:flex;justify-content:flex-end;margin-top:18px">
      <Button variant="primary" icon={Copy} onclick={() => copy(out)}>Copy result</Button>
    </div>
  </div>
</div>
