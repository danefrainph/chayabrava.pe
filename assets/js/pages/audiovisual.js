/* ==========================================================================
   AUDIOVISUAL — filtros de galería y visor (lightbox)
   ========================================================================== */
(() => {
  "use strict";

  const items = [...document.querySelectorAll(".g-item")];

  /* ---------- Filtros ---------- */
  const filters = document.querySelectorAll(".filter");
  filters.forEach((f) => f.addEventListener("click", () => {
    const cat = f.dataset.filter;
    filters.forEach((b) => b.setAttribute("aria-pressed", String(b === f)));
    items.forEach((it, i) => {
      const show = cat === "all" || it.dataset.cat === cat;
      it.classList.toggle("is-hidden", !show);
      it.classList.remove("is-entering");
      if (show) {
        void it.offsetWidth; // reinicia la animación
        it.style.animationDelay = `${(i % 6) * 0.05}s`;
        it.classList.add("is-entering");
      }
    });
  }));

  /* ---------- Lightbox ---------- */
  const lb = document.querySelector(".lightbox");
  if (!lb || typeof lb.showModal !== "function") return;
  const img = lb.querySelector(".lightbox__img");
  const capT = lb.querySelector(".lightbox__cap strong");
  const capS = lb.querySelector(".lightbox__cap span");
  const count = lb.querySelector(".lightbox__count");
  let list = [];
  let index = 0;
  let opener = null;

  const show = (i) => {
    index = (i + list.length) % list.length;
    const b = list[index];
    img.src = b.dataset.full;
    img.alt = b.querySelector("img").alt;
    capT.textContent = b.dataset.title;
    capS.textContent = b.dataset.sub;
    count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}`;
    img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
  };

  items.forEach((it) => {
    const btn = it.querySelector(".g-item__btn");
    btn.addEventListener("click", () => {
      list = items.filter((x) => !x.classList.contains("is-hidden")).map((x) => x.querySelector(".g-item__btn"));
      opener = btn;
      show(list.indexOf(btn));
      lb.showModal();
      document.body.style.overflow = "hidden";
    });
  });

  lb.querySelector(".lightbox__close").addEventListener("click", () => lb.close());
  lb.querySelector(".lightbox__prev").addEventListener("click", () => show(index - 1));
  lb.querySelector(".lightbox__next").addEventListener("click", () => show(index + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(index + 1);
    if (e.key === "ArrowLeft") show(index - 1);
  });
  lb.addEventListener("close", () => { document.body.style.overflow = ""; opener && opener.focus(); });

  // Gesto de deslizar en móviles
  let x0 = null;
  lb.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
