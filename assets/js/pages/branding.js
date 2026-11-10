/* ==========================================================================
   BRANDING — paletas interactivas con copia de color
   ========================================================================== */
(() => {
  "use strict";

  /* ---------- Toast ---------- */
  const toast = document.querySelector(".toast");
  let toastTimer;
  const notify = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  };

  /* ---------- Paletas ---------- */
  const opts = document.querySelectorAll(".palette__opt");
  const swatches = [...document.querySelectorAll(".swatch")];
  opts.forEach((btn) => btn.addEventListener("click", () => {
    opts.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    btn.dataset.colors.split(",").forEach((c, i) => {
      const s = swatches[i];
      if (!s) return;
      setTimeout(() => {
        s.style.setProperty("--c", c);
        s.querySelector(".swatch__hex").textContent = c;
        s.setAttribute("aria-label", `Copiar color ${c}`);
      }, i * 70);
    });
  }));
  swatches.forEach((s) => {
    s.setAttribute("aria-label", `Copiar color ${s.textContent.trim()}`);
    s.addEventListener("click", async () => {
      const hex = s.querySelector(".swatch__hex").textContent.trim();
      try {
        await navigator.clipboard.writeText(hex);
        notify(`Color ${hex} copiado`);
      } catch (e) {
        notify(`Código del color: ${hex}`);
      }
    });
  });

})();
