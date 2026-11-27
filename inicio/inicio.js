/* ==========================================================================
   INICIO — turno de llamas, parallax del hero y alpaca que sigue el cursor
   ========================================================================== */
(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.querySelector(".hero");
  if (!hero) return;

  /* Turno de llamas: cada una se ve 15 s, sale por la izquierda y entra la siguiente por la derecha */
  const SEGUNDOS_POR_LLAMA = 15;
  const llamas = hero.querySelectorAll(".hero__alpaca");
  if (llamas.length > 1) {
    let actual = 0;
    let timer = null;
    const esperar = () => {
      clearTimeout(timer);
      timer = setTimeout(cambiar, SEGUNDOS_POR_LLAMA * 1000);
    };
    const cambiar = () => {
      const siguiente = (actual + 1) % llamas.length;
      /* No se mueve nada hasta que la imagen que entra esté lista */
      llamas[siguiente].decode().then(() => {
        llamas.forEach((l) => l.classList.remove("is-leaving"));
        llamas[actual].classList.replace("is-active", "is-leaving");
        llamas[siguiente].classList.add("is-active");
        actual = siguiente;
      }).catch(() => {}).finally(esperar);
    };
    /* Con la pestaña oculta el turno se detiene */
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) clearTimeout(timer);
      else esperar();
    });
    if (!document.hidden) esperar();
  }

  if (reduceMotion) return;

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
