/* Home — searchable grid of tools. */
function Home({ tools, query, onOpen }) {
  const q = query.trim().toLowerCase();
  const filtered = q
    ? tools.filter((t) => (t.name + ' ' + t.desc).toLowerCase().includes(q))
    : tools;
  const recent = tools.filter((t) =>
    ['converter', 'timer', 'color'].includes(t.id),
  );

  return (
    <div className="content-inner fade-up">
      <div className="page-head">
        <div className="eyebrow">A quieter toolbox</div>
        <h1 className="page-title">
          Small tools,
          <br />
          <b>done well.</b>
        </h1>
        <p className="page-sub">
          A calm collection of everyday utilities. Everything runs in your
          browser — nothing uploaded, nothing stored.
        </p>
      </div>

      {!q && (
        <>
          <div className="section-label">Recently used</div>
          <div className="tool-grid stagger">
            {recent.map((t) => (
              <Tile key={t.id} tool={t} onOpen={onOpen} />
            ))}
          </div>
        </>
      )}

      <div className="section-label">
        {q ? `Results for “${query}”` : 'All tools'}
      </div>
      {filtered.length === 0 ? (
        <div
          className="panel"
          style={{ textAlign: 'center', color: 'var(--ink-3)' }}
        >
          <Icon name="search-x" size={28} />
          <p style={{ marginTop: 10 }}>
            Nothing matches that. Try another word.
          </p>
        </div>
      ) : (
        <div className="tool-grid stagger">
          {filtered.map((t) => (
            <Tile key={t.id} tool={t} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  );
}

function Tile({ tool, onOpen }) {
  return (
    <button className="tool-tile" onClick={() => onOpen(tool.id)}>
      <div className="tool-ico">
        <Icon name={tool.icon} size={22} />
      </div>
      <div>
        <h3>{tool.name}</h3>
        <p>{tool.desc}</p>
      </div>
      <div className="tile-foot">
        <Icon name="arrow-right" size={14} /> Open
      </div>
    </button>
  );
}
Object.assign(window, { Home });
