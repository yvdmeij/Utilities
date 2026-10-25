<script lang="ts">
  import Menu from './lib/components/Menu.svelte';
  import ToastHost from './lib/components/ToastHost.svelte';
  import TopBar from './lib/components/TopBar.svelte';
  import { design } from './lib/design.svelte';
  import Base64Tool from './lib/tools/Base64Tool.svelte';
  import CaseConverter from './lib/tools/CaseConverter.svelte';
  import ColorTool from './lib/tools/ColorTool.svelte';
  import CurrencyConverter from './lib/tools/CurrencyConverter.svelte';
  import GuidGenerator from './lib/tools/GuidGenerator.svelte';
  import Home from './lib/tools/Home.svelte';
  import Timer from './lib/tools/Timer.svelte';
  import UnitConverter from './lib/tools/UnitConverter.svelte';
  import WordCounter from './lib/tools/WordCounter.svelte';

  let view = $state('home');
  let query = $state('');
  let convCat = $state('Length');
  const storedTheme = localStorage.getItem('theme');
  // First visit: follow the OS light/dark setting. After that, respect the user's choice.
  let dark = $state(
    storedTheme ? storedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  $effect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });

  function navigate(id: string, extra?: { cat?: string }) {
    query = '';
    if (id === 'converter' && extra?.cat) convCat = extra.cat;
    view = id;
    window.scrollTo(0, 0);
  }

  function onQuery(q: string) {
    query = q;
    if (view !== 'home') view = 'home';
  }

  const back = () => navigate('home');
  const glass = $derived(design.current === 'glass');
</script>

{#snippet tool()}
  {#if view === 'home'}
    <Home {query} onOpen={navigate} />
  {:else if view === 'currency'}
    <CurrencyConverter onBack={back} />
  {:else if view === 'color'}
    <ColorTool onBack={back} />
  {:else if view === 'converter'}
    <UnitConverter onBack={back} initialCat={convCat} />
  {:else if view === 'guid'}
    <GuidGenerator onBack={back} />
  {:else if view === 'timer'}
    <Timer onBack={back} />
  {:else if view === 'counter'}
    <WordCounter onBack={back} />
  {:else if view === 'case'}
    <CaseConverter onBack={back} />
  {:else if view === 'base64'}
    <Base64Tool onBack={back} />
  {/if}
{/snippet}

{#snippet topBar()}
  <TopBar
    {query}
    {onQuery}
    onHome={() => navigate('home')}
    {dark}
    onToggleDark={() => (dark = !dark)}
  >
    {#snippet left()}
      <Menu active={view} {convCat} onNavigate={navigate} {dark} onSetDark={(d) => (dark = d)} />
    {/snippet}
  </TopBar>
{/snippet}

{#if glass}
  <!-- Refraction filter for the liquid glass (Chromium only; see design.svelte.ts). -->
  <svg class="qk-refract-defs" aria-hidden="true">
    <defs>
      <filter
        id="qk-refract"
        x="-10%"
        y="-10%"
        width="120%"
        height="120%"
        color-interpolation-filters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.011"
          numOctaves="2"
          seed="7"
          result="noise"
        />
        <feGaussianBlur in="noise" stdDeviation="2.5" result="soft" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="soft"
          scale="30"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
  <div class="qk-wash"></div>
  <div class="qk-shell">
    {@render topBar()}
    <main class="qk-main">
      {@render tool()}
    </main>
  </div>
{:else}
  <div class="app">
    {@render topBar()}
    <div class="content">
      {@render tool()}
    </div>
  </div>
{/if}

<ToastHost />
