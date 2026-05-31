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
</script>

<div class="seg">
  {#each options as o (o.value)}
    <button class={value === o.value ? 'on' : ''} onclick={() => onChange(o.value)}>
      {o.label}
    </button>
  {/each}
</div>
