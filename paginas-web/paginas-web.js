/* ==========================================================================
   PÁGINAS WEB — maqueta del hero con movimiento y paquetes destacados
   ========================================================================== */
(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* La maqueta de la web flota y se inclina un poco al hacer scroll */
  const mock = document.querySelector(".w-hero__mock");
  if (mock && !reduceMotion) {
    let raf = null;
    window.addEventListener("scroll", () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const y = Math.min(window.scrollY, 900);
        mock.style.transform = `translate3d(0, ${y * -0.08}px, 0) rotate(${y * -0.006}deg)`;
      });
    }, { passive: true });
  }

  /* Si llegas desde un enlace a #paquetes, las tarjetas se iluminan */
  const glowPacks = () => {
    if (location.hash !== "#paquetes" || reduceMotion) return;
    document.querySelectorAll("#paquetes .pack").forEach((p, i) => {
      p.classList.remove("is-glow"); void p.offsetWidth;
      p.style.setProperty("--d", `${0.4 + i * 0.16}s`);
      p.classList.add("is-glow");
    });
  };
  glowPacks();
  window.addEventListener("hashchange", glowPacks);
})();
