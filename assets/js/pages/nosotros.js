/* ==========================================================================
   NOSOTROS — pestañas accesibles y lector de artículos del blog
   ========================================================================== */
(() => {
  "use strict";

  /* ---------- Pestañas (patrón WAI-ARIA) ---------- */
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

  /* ---------- Lector de artículos ---------- */
  const reader = document.querySelector(".reader");
  if (!reader || typeof reader.showModal !== "function") return;
  const content = reader.querySelector(".reader__content");
  let opener = null;

  const open = (id, trigger) => {
    const tpl = document.getElementById(id);
    if (!tpl) return;
    opener = trigger;
    content.replaceChildren(tpl.content.cloneNode(true));
    reader.showModal();
    reader.scrollTop = 0;
    if (history.replaceState) history.replaceState(null, "", `#${id}`);
  };
  const close = () => {
    reader.close();
  };

  document.querySelectorAll("[data-post]").forEach((btn) => {
    btn.addEventListener("click", () => open(btn.dataset.post, btn));
  });
  reader.querySelector(".reader__close").addEventListener("click", close);
  reader.addEventListener("click", (e) => { if (e.target === reader) close(); }); // clic fuera
  reader.addEventListener("close", () => {
    if (history.replaceState) history.replaceState(null, "", location.pathname + "#blog");
    opener && opener.focus();
  });

  // Abrir directamente si la URL trae el id del artículo (enlace compartible)
  const hash = location.hash.slice(1);
  if (hash.startsWith("post-")) {
    const trigger = document.querySelector(`[data-post="${hash}"]`);
    if (trigger) open(hash, trigger);
  }
})();
