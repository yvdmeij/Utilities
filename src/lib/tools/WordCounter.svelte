<script lang="ts">
  import { ArrowLeft, Clock, Copy, Eraser } from 'lucide-svelte';
  import Button from '../components/Button.svelte';
  import { copy } from '../toast';

  let { onBack }: { onBack: () => void } = $props();

  let text = $state('');

  const words = $derived(text.trim() ? text.trim().split(/\s+/).length : 0);
  const chars = $derived(text.length);
  const noSpace = $derived(text.replace(/\s/g, '').length);
  const sentences = $derived(text.trim() ? (text.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0);
  const readMin = $derived(Math.max(words ? 1 : 0, Math.round(words / 200)));

  const stats = $derived([
    { n: words.toLocaleString(), l: 'Words' },
    { n: chars.toLocaleString(), l: 'Characters' },
    { n: noSpace.toLocaleString(), l: 'No spaces' },
    { n: sentences.toLocaleString(), l: 'Sentences' },
  ]);
</script>

<div class="content-inner fade-up">
  <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> All tools</button>
  <div class="page-head">
    <div class="eyebrow">Write</div>
    <h1 class="page-title"><b>Word counter</b></h1>
  </div>

  <div class="panel">
    <div class="stat-grid" style="margin-bottom:24px">
      {#each stats as s (s.l)}
        <div class="stat"><div class="stat-num">{s.n}</div><div class="stat-label">{s.l}</div></div>
      {/each}
    </div>
    <div class="field">
      <span class="field-label">Your text</span>
      <textarea
        class="textarea"
        bind:value={text}
        placeholder="Paste or type your text here…"
      ></textarea>
    </div>
    <div
      style="display:flex;align-items:center;justify-content:space-between;margin-top:18px;flex-wrap:wrap;gap:12px"
    >
      <span class="ds-body-sm muted" style="display:inline-flex;align-items:center;gap:6px">
        <Clock size={14} /> ~{readMin} min read
      </span>
      <div style="display:flex;gap:10px">
        <Button variant="ghost" icon={Eraser} onclick={() => (text = '')}>Clear</Button>
        <Button variant="primary" icon={Copy} onclick={() => copy(text)}>Copy text</Button>
      </div>
    </div>
  </div>
</div>
