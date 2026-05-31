/* Top bar — menu trigger (left) + search + quick actions. */
function TopBar({ query, onQuery, leftSlot }) {
  return (
    <header className="topbar">
      {leftSlot}
      <div className="search">
        <Icon name="search" size={16} />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search tools…"
        />
      </div>
      <div className="topbar-spacer"></div>
    </header>
  );
}
Object.assign(window, { TopBar });
