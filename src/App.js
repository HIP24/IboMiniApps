import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { miniApps } from "./miniapps";
function App() {
    const [activeId, setActiveId] = useState(miniApps[0]?.id ?? null);
    const activeApp = useMemo(() => {
        if (!activeId) {
            return undefined;
        }
        return miniApps.find((app) => app.id === activeId);
    }, [activeId]);
    const ActiveMiniApp = activeApp?.component;
    return (_jsxs("div", { className: "app-shell", children: [_jsxs("aside", { className: "sidebar", children: [_jsxs("header", { className: "sidebar__header", children: [_jsx("h1", { children: "IboMiniApps" }), _jsx("p", { children: "Launch lightweight utilities in one unified workspace." })] }), _jsx("nav", { className: "miniapp-list", "aria-label": "Mini app selector", children: miniApps.map((app) => {
                            const isActive = app.id === activeId;
                            return (_jsxs("button", { type: "button", className: `miniapp-list__item${isActive ? " is-active" : ""}`, onClick: () => setActiveId(app.id), children: [app.icon ? _jsx("span", { className: "miniapp-icon", children: app.icon }) : null, _jsxs("span", { className: "miniapp-copy", children: [_jsx("span", { className: "miniapp-name", children: app.name }), _jsx("span", { className: "miniapp-description", children: app.description })] })] }, app.id));
                        }) })] }), _jsx("main", { className: "workspace", role: "main", children: ActiveMiniApp ? (_jsxs("div", { className: "workspace__surface", children: [_jsxs("header", { className: "workspace__app-header", children: [_jsx("span", { className: "workspace__app-icon", children: activeApp?.icon }), _jsxs("div", { children: [_jsx("h2", { children: activeApp?.name }), _jsx("p", { children: activeApp?.description })] })] }), _jsx("section", { className: "workspace__body", "aria-live": "polite", children: _jsx(ActiveMiniApp, {}) })] })) : (_jsx(EmptyState, {})) })] }));
}
function EmptyState() {
    return (_jsxs("div", { className: "workspace__empty", children: [_jsx("h2", { children: "Select a mini app to get started" }), _jsx("p", { children: "Use the list on the left to open a utility." })] }));
}
export default App;
