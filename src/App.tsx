import { useMemo, useState } from "react";
import { miniApps } from "./miniapps";
import type { MiniAppDefinition } from "./miniapps/types";

function App() {
  const [activeId, setActiveId] = useState<string | null>(
    miniApps[0]?.id ?? null
  );

  const activeApp = useMemo<MiniAppDefinition | undefined>(() => {
    if (!activeId) {
      return undefined;
    }

    return miniApps.find((app) => app.id === activeId);
  }, [activeId]);

  const ActiveMiniApp = activeApp?.component;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <header className="sidebar__header">
          <h1>IboMiniApps</h1>
          <p>All useful utilities in one space.</p>
        </header>

        <nav className="miniapp-list" aria-label="Mini app selector">
          {miniApps.map((app) => {
            const isActive = app.id === activeId;

            return (
              <button
                key={app.id}
                type="button"
                className={`miniapp-list__item${isActive ? " is-active" : ""}`}
                onClick={() => setActiveId(app.id)}
              >
                {app.icon ? <span className="miniapp-icon">{app.icon}</span> : null}
                <span className="miniapp-copy">
                  <span className="miniapp-name">{app.name}</span>
                  <span className="miniapp-description">{app.description}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="workspace" role="main">
        {ActiveMiniApp ? (
          <div className="workspace__surface">
            <header className="workspace__app-header">
              <span className="workspace__app-icon">{activeApp?.icon}</span>
              <div>
                <h2>{activeApp?.name}</h2>
                <p>{activeApp?.description}</p>
              </div>
            </header>
            <section className="workspace__body" aria-live="polite">
              <ActiveMiniApp />
            </section>
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="workspace__empty">
      <h2>Select a mini app to get started</h2>
      <p>Use the list on the left to open a utility.</p>
    </div>
  );
}

export default App;
