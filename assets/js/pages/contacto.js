/* ==========================================================================
   CONTACTO — validación del formulario y envío por WhatsApp o correo
   El sitio es estático: el mensaje se arma en el navegador y se abre en
   WhatsApp o en el cliente de correo. Si luego conectas un backend
   (Formspree, Netlify Forms, PHP…), reemplaza la función "send".
   ========================================================================== */
(() => {
  "use strict";

  const form = document.getElementById("contact-form");
  if (!form) return;
  const success = document.querySelector(".form-success");
  const msg = form.querySelector("#mensaje");
  const counter = form.querySelector(".field__count");

  const LABELS = { branding: "Branding", audiovisual: "Audiovisual", web: "Páginas web", social: "Social media", otro: "Otro" };

  /* ---------- Preselección desde la URL (?servicio=branding) ---------- */
  const params = new URLSearchParams(location.search);
  const pre = params.get("servicio");
  if (pre) {
    const box = form.querySelector(`input[name="servicio"][value="${CSS.escape(pre)}"]`);
    if (box) box.checked = true;
    const extra = [params.get("plan") && `plan ${params.get("plan").replace(/-/g, " ")}`, params.get("tipo") && `tipo ${params.get("tipo")}`].filter(Boolean);
    if (extra.length && !msg.value) msg.value = `Me interesa una página web (${extra.join(", ")}). `;
  }

  /* ---------- Reglas de validación ---------- */
  const rules = {
    nombre: (v) => (v.trim().length >= 2 ? "" : "Escribe tu nombre."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Escribe un correo válido."),
    telefono: (v) => (v.replace(/\D/g, "").length >= 7 ? "" : "Escribe un número de contacto válido."),
    mensaje: (v) => (v.trim().length >= 10 ? "" : "Cuéntanos un poco más (mínimo 10 caracteres)."),
  };

  const setState = (name, error) => {
    const errEl = form.querySelector(`#${name}-err`);
    const input = form.elements[name];
    const field = (input.length ? input[0] : input).closest(".field");
    errEl.textContent = error;
    field && field.classList.toggle("is-invalid", !!error);
    field && field.classList.toggle("is-valid", !error && name in rules);
    const targets = input.length ? [...input] : [input];
    targets.forEach((t) => {
      t.setAttribute("aria-invalid", String(!!error));
      if (error) t.setAttribute("aria-describedby", `${name}-err`); else t.removeAttribute("aria-describedby");
    });
    return !error;
  };

  const validateField = (name) => {
    if (name === "servicio") {
      return setState("servicio", form.querySelectorAll('input[name="servicio"]:checked').length ? "" : "Elige al menos un servicio.");
    }
    if (name === "acepto") {
      return setState("acepto", form.elements.acepto.checked ? "" : "Necesitamos tu autorización para responderte.");
    }
    return setState(name, rules[name](form.elements[name].value));
  };

  const all = ["nombre", "email", "telefono", "servicio", "mensaje", "acepto"];

  // Validación en vivo después del primer intento
  const touched = new Set();
  form.addEventListener("input", (e) => {
    const n = e.target.name;
    if (n === "mensaje") counter.textContent = `${msg.value.length} / 1200`;
    if (touched.has(n) && all.includes(n)) validateField(n);
  });
  form.addEventListener("focusout", (e) => {
    const n = e.target.name;
    if (n in rules && e.target.value) { touched.add(n); validateField(n); }
  });
  form.addEventListener("change", (e) => {
    const n = e.target.name;
    if (n === "servicio" || n === "acepto") { touched.add(n); validateField(n); }
  });

  /* ---------- Envío ---------- */
  const buildMessage = (d) => [
    "Hola Chaya Brava, quiero cotizar un proyecto.",
    "",
    `Nombre: ${d.nombre}`,
    d.empresa ? `Empresa: ${d.empresa}` : null,
    `Correo: ${d.email}`,
    `Teléfono: ${d.telefono}`,
    `Servicios: ${d.servicios}`,
    d.presupuesto ? `Presupuesto: ${d.presupuesto}` : null,
    d.plazo ? `Plazo: ${d.plazo}` : null,
    "",
    d.mensaje,
  ].filter((l) => l !== null).join("\n");

  const send = (via, d) => {
    const text = buildMessage(d);
    if (via === "email") {
      const subject = `Cotización ${d.servicios} — ${d.nombre}`;
      location.href = `mailto:${window.CHAYA.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    } else {
      window.open(window.CHAYA.waLink(text), "_blank", "noopener");
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    all.forEach((n) => touched.add(n));
    const ok = all.map(validateField).every(Boolean);
    if (!ok) {
      form.classList.remove("is-shaking"); void form.offsetWidth; form.classList.add("is-shaking");
      const first = form.querySelector('[aria-invalid="true"]');
      first && first.focus();
      return;
    }
    const f = form.elements;
    const data = {
      nombre: f.nombre.value.trim(),
      empresa: f.empresa.value.trim(),
      email: f.email.value.trim(),
      telefono: f.telefono.value.trim(),
      servicios: [...form.querySelectorAll('input[name="servicio"]:checked')].map((c) => LABELS[c.value]).join(", "),
      presupuesto: f.presupuesto.value,
      plazo: f.plazo.value,
      mensaje: f.mensaje.value.trim(),
    };
    const via = (e.submitter && e.submitter.value) || "whatsapp";
    send(via, data);

    success.querySelector("[data-name]").textContent = data.nombre.split(" ")[0];
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });

  success.querySelector("[data-reset]").addEventListener("click", () => {
    form.reset();
    touched.clear();
    form.querySelectorAll(".is-valid, .is-invalid").forEach((el) => el.classList.remove("is-valid", "is-invalid"));
    form.querySelectorAll(".field__error").forEach((el) => { el.textContent = ""; });
    counter.textContent = "0 / 1200";
    success.hidden = true;
    form.hidden = false;
    form.elements.nombre.focus();
  });
})();
