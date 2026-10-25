<script lang="ts">
  import { design } from '../design.svelte';
  import { toasts } from '../toast';
</script>

{#if design.current === 'glass'}
  <div class="qk-toasts">
    {#each $toasts as t (t.id)}
      {@const Icon = t.icon}
      <div class="qk-toast"><Icon size={16} strokeWidth={1.75} />{t.msg}</div>
    {/each}
  </div>
{:else}
  <div class="toast-host">
    {#each $toasts as t (t.id)}
      {@const Icon = t.icon}
      <div class="toast"><Icon size={16} />{t.msg}</div>
    {/each}
  </div>
{/if}
