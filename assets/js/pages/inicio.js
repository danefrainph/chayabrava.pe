/* ==========================================================================
   INICIO — parallax del hero y carrusel de proyectos
   ========================================================================== */
(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Parallax del hero ---------- */
  const hero = document.querySelector(".hero");
  const bg = hero && hero.querySelector(".hero__bg img");
  const alpaca = hero && hero.querySelector(".hero__alpaca");
  const visual = hero && hero.querySelector(".hero__visual");

  if (hero && !reduceMotion) {
    let raf = null;
    const onScroll = () => {
      raf = null;
      const y = window.scrollY;
      if (y > hero.offsetHeight) return;
      if (bg) bg.style.transform = `translate3d(0, ${y * 0.25}px, 0)`;
    };
    window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(onScroll); }, { passive: true });

    // Inclinación sutil de la alpaca siguiendo el cursor
    if (window.matchMedia("(pointer: fine)").matches && visual) {
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        visual.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg) translate3d(${x * 14}px, ${y * 8}px, 0)`;
      });
      hero.addEventListener("pointerleave", () => { visual.style.transform = ""; });
      visual.style.transition = "transform .6s cubic-bezier(.16,1,.3,1)";
    }
  }

  /* ---------- Carrusel de proyectos ---------- */
  const viewport = document.querySelector(".projects__viewport");
  if (!viewport) return;
  const track = viewport.querySelector(".projects__track");
  const items = [...track.children];
  const prev = document.querySelector('.projects__btn[data-dir="-1"]');
  const next = document.querySelector('.projects__btn[data-dir="1"]');
  const bar = document.querySelector(".projects__progress span");

  const stepSize = () => items[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
  const update = () => {
    const max = viewport.scrollWidth - viewport.clientWidth;
    const p = max > 0 ? viewport.scrollLeft / max : 1;
    if (bar) bar.style.width = `${Math.max(p * 100, (viewport.clientWidth / viewport.scrollWidth) * 100)}%`;
    if (prev) prev.disabled = viewport.scrollLeft <= 4;
    if (next) next.disabled = viewport.scrollLeft >= max - 4;
  };
  [prev, next].forEach((b) => b && b.addEventListener("click", () => {
    viewport.scrollBy({ left: stepSize() * Number(b.dataset.dir), behavior: reduceMotion ? "auto" : "smooth" });
  }));
  viewport.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();

  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next && next.click(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prev && prev.click(); }
  });

  // Arrastrar con el mouse (en táctil se usa el scroll nativo)
  let down = false, startX = 0, startScroll = 0, moved = 0;
  viewport.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    down = true; moved = 0; startX = e.clientX; startScroll = viewport.scrollLeft;
  });
  window.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    moved = Math.abs(dx);
    if (moved > 5) viewport.classList.add("is-dragging");
    viewport.scrollLeft = startScroll - dx;
  });
  window.addEventListener("pointerup", () => {
    if (!down) return;
    down = false;
    setTimeout(() => viewport.classList.remove("is-dragging"), 0);
  });
  viewport.addEventListener("click", (e) => { if (moved > 5) { e.preventDefault(); moved = 0; } }, true);
})();
