<script lang="ts">
  import { Copy } from 'lucide-svelte';
  import { t } from '../../i18n.svelte';
  import { copy } from '../../toast';

  let { value, empty, error = '' }: { value: string; empty: string; error?: string } = $props();
</script>

<div class="qk-output {error ? 'err' : !value ? 'empty' : ''}">
  {error || value || empty}
  {#if value && !error}
    <button
      class="qk-ibtn sm"
      onclick={() => copy(value)}
      aria-label={t('common.copyResult')}
      title={t('common.copyResult')}
    >
      <Copy size={15} strokeWidth={1.75} />
    </button>
  {/if}
</div>
