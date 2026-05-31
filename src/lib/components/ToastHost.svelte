<script lang="ts">
  import { toasts } from '../toast';
</script>

<div class="toast-host">
  {#each $toasts as t (t.id)}
    {@const Icon = t.icon}
    <div class="toast"><Icon size={16} />{t.msg}</div>
  {/each}
</div>
