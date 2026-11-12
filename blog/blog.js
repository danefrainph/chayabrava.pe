/* ==========================================================================
   BLOG — lector de artículos en ventana, con enlace compartible (#post-…)
   ========================================================================== */
(() => {
  "use strict";

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

  document.querySelectorAll("[data-post]").forEach((btn) => {
    btn.addEventListener("click", () => open(btn.dataset.post, btn));
  });
  reader.querySelector(".reader__close").addEventListener("click", () => reader.close());
  reader.addEventListener("click", (e) => { if (e.target === reader) reader.close(); });
  reader.addEventListener("close", () => {
    if (history.replaceState) history.replaceState(null, "", location.pathname);
    opener && opener.focus();
  });

  // Abrir directamente si la URL trae el id del artículo
  const hash = location.hash.slice(1);
  if (hash.startsWith("post-")) {
    const trigger = document.querySelector(`[data-post="${hash}"]`);
    if (trigger) open(hash, trigger);
  }
})();
