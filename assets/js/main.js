/* ==========================================================================
   CHAYA BRAVA — JS global (se carga en todas las páginas)
   Header, menú móvil, animaciones de aparición, contadores y utilidades.
   ========================================================================== */
(() => {
  "use strict";

  const doc = document.documentElement;
  doc.classList.remove("no-js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Datos de contacto (un solo lugar para editarlos) ---------- */
  window.CHAYA = {
    whatsapp: "51987270466",
    email: "chayabrava@gmail.com",
    waLink(msg = "Hola Chaya Brava, quiero cotizar un proyecto.") {
      return `https://wa.me/${this.whatsapp}?text=${encodeURIComponent(msg)}`;
    }
  };

  /* ---------- Preloader (solo en la primera visita de la sesión) ---------- */
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    let seen = false;
    try { seen = sessionStorage.getItem("cb-preloader") === "1"; } catch (e) {}
    if (seen || reduceMotion) {
      preloader.remove();
    } else {
      const done = () => {
        preloader.classList.add("is-done");
        try { sessionStorage.setItem("cb-preloader", "1"); } catch (e) {}
        setTimeout(() => preloader.remove(), 1000);
      };
      window.addEventListener("load", () => setTimeout(done, 650));
      setTimeout(done, 3500); // por si alguna imagen tarda demasiado
    }
  }

  /* ---------- Header: fijo al hacer scroll, se oculta al bajar ---------- */
  const header = document.querySelector(".header");
  const toTop = document.querySelector(".to-top");
  let lastY = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle("is-fixed", y > 160);
      header.classList.toggle("is-hidden", y > 600 && y > lastY && !document.body.classList.contains("menu-open"));
    }
    if (toTop) toTop.classList.toggle("is-visible", y > 700);
    lastY = y;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
  toTop && toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---------- Menú móvil ---------- */
  const burger = document.querySelector(".burger");
  const mobileMenu = document.getElementById("mobile-menu");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    mobileMenu.setAttribute("aria-hidden", String(!open));
    if (open) mobileMenu.querySelector("a").focus({ preventScroll: true });
  };
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
    mobileMenu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) { setMenu(false); burger.focus(); }
    });
    window.matchMedia("(min-width: 961px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });
  }

  /* ---------- Títulos divididos en líneas animadas ---------- */
  document.querySelectorAll("[data-split]").forEach((el) => {
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = lines
      .map((l, i) => `<span class="split-line" style="--d:${(i * 0.12).toFixed(2)}s"><span>${l.trim()}</span></span>`)
      .join("");
    el.classList.add("reveal-split");
  });

  /* ---------- Aparición al hacer scroll ---------- */
  const revealables = document.querySelectorAll(".reveal, .reveal-split");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Pasos 01–04: se encienden uno tras otro ---------- */
  if ("IntersectionObserver" in window && !reduceMotion) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        [...e.target.children].forEach((li, i) => { li.style.setProperty("--d", `${i * 0.22}s`); li.classList.add("is-lit"); });
        so.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll(".steps").forEach((s) => so.observe(s));
  }

  /* ---------- Contadores animados ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const end = parseFloat(el.dataset.count);
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / 1800, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && !reduceMotion) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((c) => { c.textContent = "0"; co.observe(c); });
  }

  /* ---------- Botones magnéticos y tarjetas con inclinación ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.22}px ${(e.clientY - r.top - r.height / 2) * 0.3}px`;
      });
      el.addEventListener("pointerleave", () => { el.style.translate = ""; });
    });
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Enlaces de WhatsApp con mensaje contextual ---------- */
  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = window.CHAYA.waLink(a.dataset.wa || undefined);
    a.target = "_blank";
    a.rel = "noopener";
  });
})();
