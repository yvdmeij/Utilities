<script lang="ts">
  import { Check, Languages } from 'lucide-svelte';
  import { design } from '../design.svelte';
  import { i18n, LANGS, setLang, t } from '../i18n.svelte';

  let open = $state(false);

  function pick(id: (typeof LANGS)[number]['id']) {
    setLang(id);
    open = false;
  }
</script>

{#if design.current === 'glass'}
  <div class="qk-pop-anchor">
    <button
      class="qk-ibtn {open ? 'open' : ''}"
      onclick={() => (open = !open)}
      aria-label={t('settings.language')}
      title={t('settings.language')}
      aria-expanded={open}
    >
      <Languages size={18} strokeWidth={1.75} />
    </button>
    {#if open}
      <button class="qk-scrim" aria-label={t('menu.close')} onclick={() => (open = false)}></button>
      <div class="qk-menu narrow">
        <div class="qk-label qk-menu-label">{t('settings.language')}</div>
        {#each LANGS as l (l.id)}
          <button class="qk-nav-item {i18n.lang === l.id ? 'on' : ''}" onclick={() => pick(l.id)}>
            {l.label}
            {#if i18n.lang === l.id}<Check class="qk-check" size={16} strokeWidth={1.75} />{/if}
          </button>
        {/each}
      </div>
    {/if}
  </div>
{:else}
  <div class="menu">
    <button
      class="theme-toggle"
      onclick={() => (open = !open)}
      aria-label={t('settings.language')}
      aria-expanded={open}
    >
      <Languages size={17} strokeWidth={1.75} />
    </button>

    {#if open}
      <button class="menu-scrim" aria-label={t('menu.close')} onclick={() => (open = false)}
      ></button>

      <div class="menu-pop language-pop">
        <div class="menu-sec">
          <span class="ms-label">{t('settings.language')}</span>
        </div>
        <div class="nav">
          {#each LANGS as l (l.id)}
            <button
              class="nav-item {i18n.lang === l.id ? 'active' : ''}"
              onclick={() => pick(l.id)}
            >
              <span class="ni-label">{l.label}</span>
              {#if i18n.lang === l.id}<Check size={16} />{/if}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/if}
