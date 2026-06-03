<script lang="ts">
  import { ArrowLeft, Copy, RefreshCw } from 'lucide-svelte';
  import Button from '../components/Button.svelte';
  import Segmented from '../components/Segmented.svelte';
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

<div class="content-inner fade-up">
  <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> All tools</button>
  <div class="page-head">
    <div class="eyebrow">Generate</div>
    <h1 class="page-title"><b>GUID generator</b></h1>
  </div>

  <div class="panel">
    <div style="margin-bottom:26px">
      <div class="field-label" style="margin-bottom:11px">How many</div>
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
        <div class="field-label" style="margin-bottom:11px">Format</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <Button variant={upper ? 'primary' : 'ghost'} onclick={() => (upper = !upper)}>
            Uppercase
          </Button>
          <Button variant={hyphens ? 'primary' : 'ghost'} onclick={() => (hyphens = !hyphens)}>
            Hyphens
          </Button>
        </div>
      </div>
      <div style="display:flex;gap:10px">
        <Button variant="secondary" icon={RefreshCw} onclick={regenerate}>Regenerate</Button>
        <Button variant="primary" icon={Copy} onclick={() => text && copy(text)}>Copy all</Button>
      </div>
    </div>

    <div class="field-label" style="margin-bottom:13px">{count === 1 ? 'Result' : `${count} GUIDs`}</div>
    <div class="guid-list">
      {#each formatted as g, i (i)}
        <button class="guid-line" onclick={() => copy(g)} title="Click to copy">{g}</button>
      {/each}
    </div>
  </div>
</div>
