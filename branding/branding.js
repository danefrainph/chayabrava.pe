/* ==========================================================================
   BRANDING — cinta de servicios que sigue el scroll y paquetes destacados
   ========================================================================== */
(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* La cinta amarilla cambia de sentido según hacia dónde haces scroll */
  const track = document.querySelector(".b-ribbon__track");
  if (track && !reduceMotion) {
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 4) return;
      track.style.animationDirection = y > lastY ? "normal" : "reverse";
      lastY = y;
    }, { passive: true });
  }

  /* Si llegas desde un enlace a #paquetes (por ejemplo, desde Challu),
     las tarjetas se iluminan una tras otra */
  const glowPacks = () => {
    if (location.hash !== "#paquetes" || reduceMotion) return;
    document.querySelectorAll("#paquetes .pack").forEach((p, i) => {
      p.classList.remove("is-glow"); void p.offsetWidth;
      p.style.setProperty("--d", `${0.4 + i * 0.18}s`);
      p.classList.add("is-glow");
    });
  };
  glowPacks();
  window.addEventListener("hashchange", glowPacks);
})();
