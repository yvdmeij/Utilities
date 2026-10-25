<script lang="ts">
  import { Check, Settings } from 'lucide-svelte';
  import { i18n, LANGS, setLang, t } from '../i18n.svelte';

  let open = $state(false);

  function pick(id: (typeof LANGS)[number]['id']) {
    setLang(id);
    open = false;
  }
</script>

<div class="menu">
  <button
    class="theme-toggle"
    onclick={() => (open = !open)}
    aria-label={t('settings.title')}
    aria-expanded={open}
  >
    <Settings size={17} strokeWidth={1.75} />
  </button>

  {#if open}
    <button class="menu-scrim" aria-label={t('menu.close')} onclick={() => (open = false)}></button>

    <div class="menu-pop settings-pop">
      <div class="menu-sec">
        <span class="ms-label">{t('settings.language')}</span>
      </div>
      <div class="nav">
        {#each LANGS as l (l.id)}
          <button class="nav-item {i18n.lang === l.id ? 'active' : ''}" onclick={() => pick(l.id)}>
            <span class="ni-label">{l.label}</span>
            {#if i18n.lang === l.id}<Check size={16} />{/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
