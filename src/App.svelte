<script lang="ts">
  import Menu from './lib/components/Menu.svelte';
  import ToastHost from './lib/components/ToastHost.svelte';
  import TopBar from './lib/components/TopBar.svelte';
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
  }

  function onQuery(q: string) {
    query = q;
    if (view !== 'home') view = 'home';
  }

  const back = () => navigate('home');
</script>

<div class="app">
  <TopBar
    {query}
    {onQuery}
    onHome={() => navigate('home')}
    {dark}
    onToggleDark={() => (dark = !dark)}
  >
    {#snippet left()}
      {#if view !== 'home'}
        <Menu active={view} {convCat} onNavigate={navigate} />
      {/if}
    {/snippet}
  </TopBar>

  <div class="content">
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
  </div>

  <ToastHost />
</div>
