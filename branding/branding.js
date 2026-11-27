/* ==========================================================================
   BRANDING — paquetes destacados
   ========================================================================== */
(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Si llegas desde un enlace a #paquetes (por ejemplo, desde Challu),
     las tarjetas se iluminan una tras otra */
  const glowPacks = () => {
    if (location.hash !== "#paquetes" || reduceMotion) return;
    document.querySelectorAll("#paquetes .br-pack").forEach((p, i) => {
      p.classList.remove("is-glow"); void p.offsetWidth;
      p.style.setProperty("--d", `${0.4 + i * 0.18}s`);
      p.classList.add("is-glow");
    });
  };
  glowPacks();
  window.addEventListener("hashchange", glowPacks);
})();
