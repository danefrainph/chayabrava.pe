/* ==========================================================================
   INICIO — parallax del hero y alpaca que sigue el cursor
   ========================================================================== */
(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.querySelector(".hero");
  if (!hero || reduceMotion) return;

  const bg = hero.querySelector(".hero__bg img");
  const visual = hero.querySelector(".hero__visual");

  /* Parallax suave del fondo */
  let raf = null;
  window.addEventListener("scroll", () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      const y = window.scrollY;
      if (y <= hero.offsetHeight && bg) bg.style.transform = `translate3d(0, ${y * 0.22}px, 0)`;
    });
  }, { passive: true });

  /* La alpaca se inclina siguiendo el cursor */
  if (visual && window.matchMedia("(pointer: fine)").matches) {
    visual.style.transition = "transform .6s cubic-bezier(.16,1,.3,1)";
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      visual.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 5}deg) translate3d(${x * 16}px, ${y * 6}px, 0)`;
    });
    hero.addEventListener("pointerleave", () => { visual.style.transform = ""; });
  }
})();
