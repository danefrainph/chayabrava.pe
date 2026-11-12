/* ==========================================================================
   CHALLU — bot de preguntas frecuentes de Chaya Brava
   Se muestra encima del botón de WhatsApp en todas las páginas.
   Responde las preguntas frecuentes y reconoce palabras clave cuando el
   visitante escribe. Para cambiar textos, edita FAQ y EXTRA más abajo.
   ========================================================================== */
(() => {
  "use strict";

  const script = document.currentScript;
  const root = new URL("../../", script.src);          // raíz del sitio
  const url = (path) => new URL(path, root).href;
  const img = url("assets/img/personajes/challu.webp");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const waLink = (msg) => (window.CHAYA && window.CHAYA.waLink)
    ? window.CHAYA.waLink(msg)
    : `https://wa.me/51987270466?text=${encodeURIComponent(msg)}`;

  /* ---------- Preguntas frecuentes (botones amarillos) ---------- */
  const FAQ = [
    {
      id: "web",
      q: "¿Cuánto demora hacer mi página web?",
      a: `Depende del tipo de web: una <strong>landing page</strong> toma entre 1 y 2 semanas, una <strong>web corporativa</strong> alrededor de 3 semanas y una <strong>tienda online</strong> unas 5 semanas. El plazo exacto lo confirmamos en tu propuesta. <a href="${url("paginas-web/index.html")}">Ver páginas web</a>`,
    },
    {
      id: "branding",
      q: "¿Cuánto tiempo toma un proyecto de branding?",
      a: `Según el paquete: el <strong>Básico</strong> se entrega en 7 días, el <strong>Intermedio</strong> en 14 días y el <strong>Avanzado</strong> en 2 meses, porque incluye análisis estratégico, manual completo y prototipo web. <a href="${url("branding/index.html#paquetes")}">Ver paquetes de branding</a>`,
    },
    {
      id: "renovar",
      q: "¿Pueden renovar una marca que ya existe?",
      a: "¡Claro! Hacemos <strong>rebranding</strong> cuidando el reconocimiento que ya ganaste: modernizamos tu imagen sin perder a tus clientes actuales.",
    },
    {
      id: "lima",
      q: "¿Trabajan con empresas fuera de Lima?",
      a: "Sí. Trabajamos con marcas de todo el Perú y del extranjero. Las reuniones son por videollamada y todas las entregas son digitales.",
    },
    {
      id: "cotizar",
      q: "¿Qué información necesitan para cotizar?",
      a: `Cuéntanos a qué se dedica tu negocio, qué servicio necesitas, para cuándo lo necesitas y, si lo tienes, un rango de presupuesto. Con eso armamos una propuesta a tu medida. <a href="${url("contacto/index.html")}">Cotizar ahora</a>`,
    },
  ];

  /* ---------- Respuestas extra para lo que el visitante escribe ---------- */
  const EXTRA = {
    saludo: "¡Alliyachu! 😊 ¿En qué te ayudo? Puedes escribirme o elegir una de las preguntas.",
    gracias: "¡De nada! Aquí estaré si necesitas algo más. 🦙",
    precioBranding: `Nuestros paquetes de branding: <strong>Básico S/ 790</strong>, <strong>Intermedio S/ 1490</strong> y <strong>Avanzado S/ 2990</strong>. <a href="${url("branding/index.html#paquetes")}">Ver qué incluye cada uno</a>`,
    precioWeb: `Tenemos paquetes desde <strong>S/ 790</strong> hasta el <strong>Premium de S/ 3500</strong>. <a href="${url("paginas-web/index.html#paquetes")}">Ver paquetes</a>`,
    audiovisual: `Hacemos fotografía de producto e inmobiliaria, videos publicitarios, corporativos y para hoteles y restaurantes. <a href="${url("audiovisual/index.html")}">Ver audiovisual</a>`,
    contacto: `Escríbenos al <strong>987 270 466</strong> o a <strong>chayabrava@gmail.com</strong>.<br><a class="challu__wa" href="${waLink("Hola Chaya Brava, vengo de la web y quiero información.")}" target="_blank" rel="noopener">Escribir por WhatsApp</a>`,
    noSe: `Mmm, esa no me la sé 🤔. Elige una de las preguntas frecuentes o escríbele a nuestro equipo:<br><a class="challu__wa" href="${waLink("Hola Chaya Brava, tengo una consulta.")}" target="_blank" rel="noopener">Escribir por WhatsApp</a>`,
  };

  /* ---------- Reconocimiento de palabras clave ---------- */
  const W = {
    saludo: ["hola", "buenas", "buenos dias", "hey", "alli", "que tal"],
    gracias: ["gracias", "genial", "perfecto", "excelente", "chevere"],
    lima: ["lima", "provincia", "fuera", "extranjero", "otro pais", "otra ciudad", "remoto", "virtual", "arequipa", "cusco", "trujillo", "piura"],
    renovar: ["renov", "rebrand", "redise", "ya existe", "actualiz", "moderniz", "cambiar mi logo", "mejorar mi marca"],
    precio: ["precio", "costo", "cuesta", "cuanto sale", "tarifa", "paquete", "presupuesto", "plan"],
    tiempo: ["demora", "tiempo", "tarda", "plazo", "dias", "semana", "rapido", "cuando", "entrega", "mes"],
    web: ["web", "pagina", "sitio", "landing", "tienda", "ecommerce", "online", "dominio", "hosting", "seo"],
    branding: ["branding", "marca", "logo", "identidad", "manual", "papeleria", "naming"],
    audiovisual: ["audiovisual", "video", "foto", "reel", "grabacion", "produccion", "spot"],
    cotizar: ["cotiz", "informacion", "necesitan", "datos", "propuesta"],
    contacto: ["whatsapp", "telefono", "celular", "correo", "email", "contact", "llamar", "numero"],
  };
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const has = (t, key) => W[key].some((w) => t.includes(w));
  const faq = (id) => FAQ.find((f) => f.id === id).a;

  const answerFor = (text) => {
    const t = ` ${norm(text)} `;
    if (has(t, "gracias")) return EXTRA.gracias;
    if (has(t, "lima")) return faq("lima");
    if (has(t, "renovar")) return faq("renovar");
    if (has(t, "precio")) {
      if (has(t, "web")) return EXTRA.precioWeb;
      if (has(t, "branding")) return EXTRA.precioBranding;
      if (has(t, "audiovisual")) return EXTRA.audiovisual;
      return faq("cotizar");
    }
    if (has(t, "tiempo")) {
      if (has(t, "web")) return faq("web");
      if (has(t, "branding")) return faq("branding");
    }
    if (has(t, "cotizar")) return faq("cotizar");
    if (has(t, "contacto")) return EXTRA.contacto;
    if (has(t, "web")) return faq("web");
    if (has(t, "branding")) return faq("branding");
    if (has(t, "audiovisual")) return EXTRA.audiovisual;
    if (has(t, "saludo")) return EXTRA.saludo;
    return EXTRA.noSe;
  };

  /* ---------- Interfaz ---------- */
  const el = document.createElement("div");
  el.className = "challu";
  el.innerHTML = `
    <div class="challu__panel" id="challu-panel" role="dialog" aria-modal="false" aria-labelledby="challu-name">
      <div class="challu__head">
        <span class="challu__avatar" aria-hidden="true"><img src="${img}" alt="" width="60" height="62"></span>
        <div>
          <p class="challu__name" id="challu-name">Challu</p>
          <p class="challu__status">Asistente de Chaya Brava</p>
        </div>
        <button class="challu__close" type="button" aria-label="Cerrar chat">
          <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="2.2"/></svg>
        </button>
      </div>
      <div class="challu__log" role="log" aria-live="polite"></div>
      <form class="challu__form" autocomplete="off">
        <label class="sr-only" for="challu-input">Escribe tu pregunta</label>
        <input class="challu__input" id="challu-input" type="text" placeholder="Escribe aquí" maxlength="200">
        <button class="challu__send" type="submit" aria-label="Enviar pregunta">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h16M13 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6"/></svg>
        </button>
      </form>
    </div>
    <button class="challu__launcher" type="button" aria-expanded="false" aria-controls="challu-panel" aria-label="Abrir chat con Challu, asistente de preguntas frecuentes">
      <span class="challu__bubble" aria-hidden="true">Alliyachu...<br>soy Challu</span>
      <img src="${img}" alt="" width="378" height="392">
    </button>`;

  const wa = document.querySelector(".wa-float");
  (wa ? wa.parentNode : document.body).insertBefore(el, wa || null);

  const launcher = el.querySelector(".challu__launcher");
  const panel = el.querySelector(".challu__panel");
  const log = el.querySelector(".challu__log");
  const form = el.querySelector(".challu__form");
  const input = el.querySelector(".challu__input");

  const faqBox = document.createElement("div");
  faqBox.className = "challu__faq";
  faqBox.innerHTML = FAQ.map((f) => `<button class="challu__chip" type="button" data-faq="${f.id}">${f.q}</button>`).join("");

  const scrollDown = () => { log.scrollTop = log.scrollHeight; };
  const addMsg = (html, who) => {
    const m = document.createElement("div");
    m.className = `challu__msg challu__msg--${who}`;
    if (who === "user") m.textContent = html; else m.innerHTML = html;
    log.insertBefore(m, faqBox.parentNode === log ? faqBox : null);
    scrollDown();
    return m;
  };
  let busy = false;
  const reply = (question, answer) => {
    if (busy) return;
    busy = true;
    addMsg(question, "user");
    const typing = addMsg('<span class="challu__typing" aria-label="Challu está escribiendo"><i></i><i></i><i></i></span>', "bot");
    typing.style.padding = "0";
    setTimeout(() => {
      typing.remove();
      addMsg(answer, "bot");
      log.appendChild(faqBox);   // las preguntas quedan siempre al final
      scrollDown();
      busy = false;
    }, reduceMotion ? 0 : 700);
  };

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    addMsg("Alliyachu... soy <strong>Challu</strong> 👋 Te ayudo con las preguntas más frecuentes. Elige una o escríbeme.", "bot");
    log.appendChild(faqBox);
  };

  const setOpen = (open) => {
    el.classList.toggle("is-open", open);
    launcher.setAttribute("aria-expanded", String(open));
    launcher.setAttribute("aria-label", open ? "Cerrar chat con Challu" : "Abrir chat con Challu, asistente de preguntas frecuentes");
    if (open) {
      start();
      el.classList.add("is-quiet");
      try { sessionStorage.setItem("cb-challu", "1"); } catch (e) {}
      const fine = window.matchMedia("(pointer: fine)").matches;
      setTimeout(() => (fine ? input : faqBox.querySelector("button")).focus({ preventScroll: true }), 120);
    }
  };

  // Si ya abrió el chat en esta visita, el globo no vuelve a aparecer
  try { if (sessionStorage.getItem("cb-challu") === "1") el.classList.add("is-quiet"); } catch (e) {}

  launcher.addEventListener("click", () => setOpen(!el.classList.contains("is-open")));
  el.querySelector(".challu__close").addEventListener("click", () => { setOpen(false); launcher.focus(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && el.classList.contains("is-open")) { setOpen(false); launcher.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (el.classList.contains("is-open") && !el.contains(e.target)) setOpen(false);
  });

  faqBox.addEventListener("click", (e) => {
    const b = e.target.closest("[data-faq]");
    if (!b) return;
    const f = FAQ.find((x) => x.id === b.dataset.faq);
    reply(f.q, f.a);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || busy) return;
    input.value = "";
    reply(text, answerFor(text));
  });

  // Abrir el chat desde cualquier enlace con data-challu
  document.querySelectorAll("[data-challu]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation(); setOpen(true);
  }));
})();
