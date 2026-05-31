/* Main app — collapsible + menu + tool routing. */
const TOOLS = [
  {
    id: 'converter',
    name: 'Unit converter',
    icon: 'ruler',
    desc: 'Length, weight, volume & data.',
    C: 'UnitConverter',
  },
  {
    id: 'timer',
    name: 'Timer',
    icon: 'timer',
    desc: 'Focus sessions & countdowns.',
    C: 'Timer',
  },
  {
    id: 'color',
    name: 'Color picker',
    icon: 'palette',
    desc: 'Hex, RGB & HSL — copy any.',
    C: 'ColorTool',
  },
  {
    id: 'counter',
    name: 'Word counter',
    icon: 'pilcrow',
    desc: 'Words, characters & read time.',
    C: 'WordCounter',
  },
  {
    id: 'case',
    name: 'Case converter',
    icon: 'case-sensitive',
    desc: 'Upper, lower, title & sentence.',
    C: 'CaseConverter',
  },
  {
    id: 'base64',
    name: 'Base64',
    icon: 'binary',
    desc: 'Encode & decode text.',
    C: 'Base64Tool',
    badge: 'New',
  },
];

function App() {
  const [view, setView] = React.useState('home');
  const [query, setQuery] = React.useState('');
  const [convCat, setConvCat] = React.useState('Length');

  const navigate = (id, extra) => {
    setQuery('');
    if (id === 'converter' && extra && extra.cat) setConvCat(extra.cat);
    setView(id);
  };

  const tool = TOOLS.find((t) => t.id === view);
  let body;
  if (view === 'home') {
    body = <Home tools={TOOLS} query={query} onOpen={navigate} />;
  } else if (tool) {
    const Comp = window[tool.C];
    body =
      tool.id === 'converter' ? (
        <UnitConverter onBack={() => navigate('home')} initialCat={convCat} />
      ) : (
        <Comp onBack={() => navigate('home')} />
      );
  }

  return (
    <div className="app">
      <TopBar
        query={query}
        onQuery={(q) => {
          setQuery(q);
          if (view !== 'home') setView('home');
        }}
        leftSlot={
          <Menu
            tools={TOOLS}
            active={view}
            convCat={convCat}
            onNavigate={navigate}
          />
        }
      />
      <div className="content">{body}</div>
      <ToastHost />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
