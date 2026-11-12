/* ==========================================================================
   NOSOTROS — pestañas Misión / Visión / Propósito (patrón WAI-ARIA)
   ========================================================================== */
(() => {
  "use strict";

  document.querySelectorAll("[data-tabs]").forEach((root) => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const select = (tab, focus = true) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t, false));
      t.addEventListener("keydown", (e) => {
        const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (dir) { e.preventDefault(); select(tabs[(i + dir + tabs.length) % tabs.length]); }
        if (e.key === "Home") { e.preventDefault(); select(tabs[0]); }
        if (e.key === "End") { e.preventDefault(); select(tabs[tabs.length - 1]); }
      });
    });
  });
})();
