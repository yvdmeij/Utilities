<script lang="ts">
  import { ArrowLeft, Bell, Pause, Play, RotateCcw } from 'lucide-svelte';
  import Button from '../components/Button.svelte';
  import Segmented from '../components/Segmented.svelte';
  import Seg from '../components/glass/Seg.svelte';
  import ToolPage from '../components/glass/ToolPage.svelte';
  import { design } from '../design.svelte';
  import { t } from '../i18n.svelte';
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
        toast(t('timer.timesUp'), Bell);
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
  const status = $derived(
    running
      ? t('timer.running')
      : left === 0
        ? t('timer.done')
        : left === total
          ? t('timer.ready')
          : t('timer.paused')
  );
  const R = 110;
  const C = 2 * Math.PI * R;
</script>

{#if design.current === 'glass'}
  <ToolPage {onBack} eyebrow={t('eyebrow.focus')} title={t('timer.title')}>
    <div class="qk-card qk-center" style="gap:32px">
      <Seg options={presets} value={total} onChange={pick} />
      <div class="qk-dial">
        <svg viewBox="0 0 280 280">
          <circle cx="140" cy="140" r="128" fill="none" stroke="var(--fill-2)" stroke-width="10" />
          <circle
            cx="140"
            cy="140"
            r="128"
            fill="none"
            stroke="var(--accent)"
            stroke-width="10"
            stroke-linecap="round"
            stroke-dasharray={2 * Math.PI * 128}
            stroke-dashoffset={2 * Math.PI * 128 * (1 - pct)}
          />
        </svg>
        <div class="qk-dial-c">
          <div class="qk-time">{mm}:{ss}</div>
          <span class="qk-label">{status}</span>
        </div>
      </div>
      <div class="qk-actions" style="justify-content:center">
        <button class="qk-btn qk-btn-primary" style="min-width:120px" onclick={toggle}>
          {#if running}<Pause size={16} strokeWidth={1.75} />{:else}<Play
              size={16}
              strokeWidth={1.75}
            />{/if}
          {running ? t('timer.pause') : t('timer.start')}
        </button>
        <button class="qk-btn qk-btn-secondary" onclick={reset}>
          <RotateCcw size={16} strokeWidth={1.75} />{t('timer.reset')}
        </button>
      </div>
    </div>
  </ToolPage>
{:else}
  <div class="content-inner fade-up">
    <button class="back-btn" onclick={onBack}><ArrowLeft size={16} /> {t('menu.allTools')}</button>
    <div class="page-head center">
      <div class="eyebrow">{t('eyebrow.focus')}</div>
      <h1 class="page-title"><b>{t('timer.title')}</b></h1>
    </div>

    <div class="panel">
      <div class="timer-wrap">
        <div style="display:flex;justify-content:center">
          <Segmented options={presets} value={total} onChange={pick} />
        </div>

        <div class="timer-dial">
          <svg width="240" height="240">
            <circle
              cx="120"
              cy="120"
              r={R}
              fill="none"
              stroke="var(--bg-sunken)"
              stroke-width="10"
            />
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
              {running ? t('timer.running') : left === 0 ? t('timer.done') : t('timer.paused')}
            </div>
          </div>
        </div>

        <div class="timer-controls">
          <Button variant="primary" icon={running ? Pause : Play} onclick={toggle}>
            {running ? t('timer.pause') : t('timer.start')}
          </Button>
          <Button variant="secondary" icon={RotateCcw} onclick={reset}>{t('timer.reset')}</Button>
        </div>
      </div>
    </div>
  </div>
{/if}
