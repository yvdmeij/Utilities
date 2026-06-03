<script lang="ts">
  import { ArrowLeft, Bell, Pause, Play, RotateCcw } from 'lucide-svelte';
  import Button from '../components/Button.svelte';
  import Segmented from '../components/Segmented.svelte';
  import { toast } from '../toast';

  let { onBack }: { onBack: () => void } = $props();

  const presets = [
    { value: 300, label: '5m' },
    { value: 900, label: '15m' },
    { value: 1500, label: '25m' },
    { value: 3000, label: '50m' },
  ];

  let total = $state(1500);
  let left = $state(1500);
  let running = $state(false);

  $effect(() => {
    if (!running) return;
    const id = setInterval(() => {
      left -= 1;
      if (left <= 0) {
        left = 0;
        running = false;
        clearInterval(id);
        toast("Time's up", Bell);
      }
    }, 1000);
    return () => clearInterval(id);
  });

  function pick(v: number) {
    total = v;
    left = v;
    running = false;
  }
  function reset() {
    left = total;
    running = false;
  }
  function toggle() {
    if (left > 0) running = !running;
  }

  const mm = $derived(String(Math.floor(left / 60)).padStart(2, '0'));
  const ss = $derived(String(left % 60).padStart(2, '0'));
  const pct = $derived(total ? left / total : 0);
  const R = 110;
  const C = 2 * Math.PI * R;
</script>

<div class="content-inner fade-up">
  <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> All tools</button>
  <div class="page-head center">
    <div class="eyebrow">Focus</div>
    <h1 class="page-title"><b>Timer</b></h1>
  </div>

  <div class="panel">
    <div class="timer-wrap">
      <div style="display:flex;justify-content:center">
        <Segmented options={presets} value={total} onChange={pick} />
      </div>

      <div class="timer-dial">
        <svg width="240" height="240">
          <circle cx="120" cy="120" r={R} fill="none" stroke="var(--bg-sunken)" stroke-width="10" />
          <circle
            cx="120"
            cy="120"
            r={R}
            fill="none"
            stroke="var(--accent)"
            stroke-width="10"
            stroke-linecap="round"
            stroke-dasharray={C}
            stroke-dashoffset={C * (1 - pct)}
            style="transition:stroke-dashoffset 1s linear"
          />
        </svg>
        <div class="time">
          <div class="readout" style="font-size:56px">{mm}:{ss}</div>
          <div class="field-label" style="margin-top:10px">
            {running ? 'Running' : left === 0 ? 'Done' : 'Paused'}
          </div>
        </div>
      </div>

      <div class="timer-controls">
        <Button variant="primary" icon={running ? Pause : Play} onclick={toggle}>
          {running ? 'Pause' : 'Start'}
        </Button>
        <Button variant="secondary" icon={RotateCcw} onclick={reset}>Reset</Button>
      </div>
    </div>
  </div>
</div>
