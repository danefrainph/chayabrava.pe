/* ==========================================================================
   CHAYA BRAVA — JS global
   Header, menú móvil, animaciones de aparición, contadores, utilidades.
   ========================================================================== */
(() => {
  "use strict";

  const doc = document.documentElement;
  doc.classList.remove("no-js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  const ring = toTop && toTop.querySelector("circle");
  const ringLen = ring ? 2 * Math.PI * ring.r.baseVal.value : 0;
  if (ring) { ring.style.strokeDasharray = ringLen; ring.style.strokeDashoffset = ringLen; }

  let lastY = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) {
      const threshold = 160;
      header.classList.toggle("is-fixed", y > threshold);
      header.classList.toggle("is-hidden", y > 600 && y > lastY && !document.body.classList.contains("menu-open"));
    }
    if (toTop) {
      toTop.classList.toggle("is-visible", y > 700);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (ring) ring.style.strokeDashoffset = ringLen - (y / Math.max(max, 1)) * ringLen;
    }
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
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Contadores animados ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const end = parseFloat(el.dataset.count);
    const dur = 1800;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(end * eased);
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

  /* ---------- Botones magnéticos (solo con puntero fino) ---------- */
  if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.translate = `${x}px ${y}px`;
      });
      el.addEventListener("pointerleave", () => { el.style.translate = ""; });
    });
  }

  /* ---------- Enlaces de WhatsApp con mensaje contextual ---------- */
  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = window.CHAYA.waLink(a.dataset.wa || undefined);
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* ---------- Acordeón: solo una pregunta abierta a la vez ---------- */
  document.querySelectorAll("[data-accordion]").forEach((acc) => {
    const items = acc.querySelectorAll("details");
    items.forEach((d) => d.addEventListener("toggle", () => {
      if (d.open) items.forEach((o) => { if (o !== d) o.open = false; });
    }));
  });

  /* ---------- Año en el pie ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
