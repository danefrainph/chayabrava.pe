/* ==========================================================================
   AUDIOVISUAL — visor a pantalla completa de la galería de trabajos
   (teclado ← → , Esc para cerrar y gesto de deslizar en celulares)
   ========================================================================== */
(() => {
  "use strict";

  const buttons = [...document.querySelectorAll(".g-item__btn")];
  const lb = document.querySelector(".lightbox");
  if (!buttons.length || !lb || typeof lb.showModal !== "function") return;

  const img = lb.querySelector(".lightbox__img");
  const capT = lb.querySelector(".lightbox__cap strong");
  const capS = lb.querySelector(".lightbox__cap span");
  const count = lb.querySelector(".lightbox__count");
  let index = 0;
  let opener = null;

  const show = (i) => {
    index = (i + buttons.length) % buttons.length;
    const b = buttons[index];
    img.src = b.dataset.full;
    img.alt = b.querySelector("img").alt;
    capT.textContent = b.dataset.title;
    capS.textContent = b.dataset.sub;
    count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(buttons.length).padStart(2, "0")}`;
    img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
  };

  buttons.forEach((btn, i) => btn.addEventListener("click", () => {
    opener = btn;
    show(i);
    lb.showModal();
    document.body.style.overflow = "hidden";
  }));

  lb.querySelector(".lightbox__close").addEventListener("click", () => lb.close());
  lb.querySelector(".lightbox__prev").addEventListener("click", () => show(index - 1));
  lb.querySelector(".lightbox__next").addEventListener("click", () => show(index + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(index + 1);
    if (e.key === "ArrowLeft") show(index - 1);
  });
  lb.addEventListener("close", () => { document.body.style.overflow = ""; opener && opener.focus(); });

  // Gesto de deslizar en celulares
  let x0 = null;
  lb.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
