<script lang="ts" generics="T extends string | number">
  let {
    options,
    value,
    onChange,
  }: {
    options: { value: T; label: string }[];
    value: T;
    onChange: (v: T) => void;
  } = $props();

  let track: HTMLDivElement | undefined = $state();
  let thumb = $state<{ left: number; top: number; width: number; height: number } | null>(null);
  let moving = $state(false);
  let first = true;

  // Measure the active option so the glass thumb can slide to it, and re-measure
  // whenever the track resizes (labels change with the language, too).
  $effect(() => {
    const el = track;
    value;
    options;
    if (!el) return;
    const measure = () => {
      const a = el.querySelector<HTMLElement>('[data-active="true"]');
      thumb = a
        ? { left: a.offsetLeft, top: a.offsetTop, width: a.offsetWidth, height: a.offsetHeight }
        : null;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  });

  // Squish the thumb briefly whenever the selection changes.
  $effect(() => {
    value;
    if (first) {
      first = false;
      return;
    }
    moving = true;
    const id = setTimeout(() => (moving = false), 460);
    return () => clearTimeout(id);
  });
</script>

<div class="qk-seg" role="tablist" bind:this={track}>
  {#if thumb}
    <span
      class="qk-seg-thumb {moving ? 'moving' : ''}"
      style:left="{thumb.left}px"
      style:top="{thumb.top}px"
      style:width="{thumb.width}px"
      style:height="{thumb.height}px"
    ></span>
  {/if}
  {#each options as o (o.value)}
    <button
      role="tab"
      data-active={o.value === value ? 'true' : 'false'}
      aria-selected={o.value === value}
      class="qk-seg-b {o.value === value ? 'on' : ''}"
      onclick={() => onChange(o.value)}
    >
      {o.label}
    </button>
  {/each}
</div>
