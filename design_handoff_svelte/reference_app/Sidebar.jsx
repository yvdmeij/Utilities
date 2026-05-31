/* Collapsible "+" menu. Starts closed (just a +); opens the tool options. */
function Menu({ tools, active, convCat, onNavigate }) {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState('converter');
  const cats = ['Length', 'Weight', 'Volume', 'Data'];

  const go = (id, extra) => {
    onNavigate(id, extra);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <button
        className={`menu-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
      >
        <span className="plus">
          <Icon name="plus" size={18} />
        </span>
      </button>

      {open && <div className="menu-scrim" onClick={() => setOpen(false)} />}
      {open && (
        <div className="menu-pop">
          <div className="menu-head">
            <div className="brand-mark">
              <Icon name="shapes" size={15} />
            </div>
            <div>
              <div className="mh-title">Quietkit</div>
              <div className="mh-sub">Everyday utilities</div>
            </div>
          </div>

          <button
            className={`nav-item ${active === 'home' ? 'active' : ''}`}
            onClick={() => go('home')}
          >
            <Icon name="layout-grid" size={18} />
            <span className="ni-label">All tools</span>
          </button>

          <div className="menu-sec">
            <span className="ms-label">Tools</span>
            <span className="ms-label ms-count">{tools.length}</span>
          </div>

          <div className="nav">
            {tools.map((t) => {
              if (t.id === 'converter') {
                const isExp = expanded === 'converter';
                return (
                  <React.Fragment key={t.id}>
                    <button
                      className={`nav-item ${active === 'converter' ? 'active' : ''} ${isExp ? 'expanded' : ''}`}
                      onClick={() => go('converter')}
                    >
                      <Icon name={t.icon} size={18} />
                      <span className="ni-label">{t.name}</span>
                      <span
                        className="nav-toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded(isExp ? null : 'converter');
                        }}
                      >
                        <Icon name="chevron-right" size={15} />
                      </span>
                    </button>
                    {isExp && (
                      <div className="nav-tree">
                        {cats.map((c) => (
                          <button
                            key={c}
                            className={`nav-subitem ${active === 'converter' && convCat === c ? 'active' : ''}`}
                            onClick={() => go('converter', { cat: c })}
                          >
                            <Icon name="dot" size={14} />
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                );
              }
              return (
                <button
                  key={t.id}
                  className={`nav-item ${active === t.id ? 'active' : ''}`}
                  onClick={() => go(t.id)}
                >
                  <Icon name={t.icon} size={18} />
                  <span className="ni-label">{t.name}</span>
                  {t.badge && <span className="nav-badge">{t.badge}</span>}
                </button>
              );
            })}
          </div>

          <div className="menu-foot">
            <button
              className="nav-item"
              onClick={() => {
                window.toast('Everything runs locally', 'shield-check');
                setOpen(false);
              }}
            >
              <Icon name="settings" size={18} />
              <span className="ni-label">Settings</span>
            </button>
            <button className="nav-item" onClick={() => setOpen(false)}>
              <Icon name="circle-help" size={18} />
              <span className="ni-label">About</span>
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
Object.assign(window, { Menu });
