/* ==========================================================================
   CONTACTO — validación del formulario y envío por WhatsApp o correo
   El sitio es estático: el mensaje se arma en el navegador y se abre en
   WhatsApp o en el programa de correo. Si luego conectas un backend
   (Formspree, Netlify Forms, PHP…), reemplaza la función "send".
   ========================================================================== */
(() => {
  "use strict";

  const form = document.getElementById("contact-form");
  if (!form) return;
  const card = form.closest(".c-card");
  const choice = card.querySelector(".c-choice");
  const success = card.querySelector(".form-success");
  const msg = form.elements.mensaje;
  const counter = form.querySelector(".field__count");
  const servicio = form.elements.servicio;
  const plazo = form.elements.plazo;

  /* ---------- Selects con texto de ayuda en gris ---------- */
  const paintSelect = (s) => s.classList.toggle("is-placeholder", !s.value);
  [servicio, plazo].forEach((s) => { paintSelect(s); s.addEventListener("change", () => paintSelect(s)); });

  /* ---------- Preselección desde la URL (?servicio=branding&plan=basico) ---------- */
  const params = new URLSearchParams(location.search);
  const pre = params.get("servicio");
  if (pre && [...servicio.options].some((o) => o.value === pre)) { servicio.value = pre; paintSelect(servicio); }
  const plan = params.get("plan");
  if (plan && !msg.value) {
    const nombrePlan = plan.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const area = servicio.options[servicio.selectedIndex] ? servicio.options[servicio.selectedIndex].text : "";
    msg.value = `Me interesa el paquete ${nombrePlan}${area && servicio.value ? ` de ${area}` : ""}. `;
  }

  /* ---------- Reglas de validación ---------- */
  const rules = {
    nombre: (v) => (v.trim().length >= 2 ? "" : "Escribe tu nombre."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Escribe un correo válido."),
    telefono: (v) => (v.replace(/\D/g, "").length >= 7 ? "" : "Escribe un número de contacto válido."),
    acepto: () => (form.elements.acepto.checked ? "" : "Necesitamos tu autorización para responderte."),
  };
  const required = Object.keys(rules);

  const setState = (name, error) => {
    const input = form.elements[name];
    const errEl = form.querySelector(`#${name}-err`);
    const box = input.closest(".field, .consent");
    errEl.textContent = error;
    box.classList.toggle("is-invalid", !!error);
    if (input.type !== "checkbox") box.classList.toggle("is-valid", !error);
    input.setAttribute("aria-invalid", String(!!error));
    if (error) input.setAttribute("aria-describedby", `${name}-err`); else input.removeAttribute("aria-describedby");
    return !error;
  };
  const validate = (name) => setState(name, rules[name](form.elements[name].value));

  const touched = new Set();
  form.addEventListener("input", (e) => {
    const n = e.target.name;
    if (n === "mensaje" && counter) counter.textContent = `${msg.value.length} / 1200`;
    if (touched.has(n) && rules[n]) validate(n);
  });
  form.addEventListener("focusout", (e) => {
    const n = e.target.name;
    if (rules[n] && e.target.value && e.target.type !== "checkbox") { touched.add(n); validate(n); }
  });
  form.addEventListener("change", (e) => {
    if (e.target.name === "acepto") { touched.add("acepto"); validate("acepto"); }
  });

  /* ---------- Envío ---------- */
  const collect = () => {
    const f = form.elements;
    return {
      nombre: f.nombre.value.trim(),
      empresa: f.empresa.value.trim(),
      email: f.email.value.trim(),
      telefono: f.telefono.value.trim(),
      servicio: servicio.value ? servicio.options[servicio.selectedIndex].text : "Por definir",
      plazo: plazo.value ? plazo.options[plazo.selectedIndex].text : "",
      mensaje: f.mensaje.value.trim(),
    };
  };
  const buildMessage = (d) => [
    "Hola Chaya Brava, quiero cotizar un proyecto.",
    "",
    `Nombre: ${d.nombre}`,
    d.empresa ? `Empresa: ${d.empresa}` : null,
    `Correo: ${d.email}`,
    `Teléfono: ${d.telefono}`,
    `Servicio: ${d.servicio}`,
    d.plazo ? `Para cuándo: ${d.plazo}` : null,
    d.mensaje ? "" : null,
    d.mensaje || null,
  ].filter((l) => l !== null).join("\n");

  const send = (via, d) => {
    const text = buildMessage(d);
    if (via === "email") {
      const subject = `Cotización ${d.servicio} — ${d.nombre}`;
      location.href = `mailto:${window.CHAYA.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    } else {
      window.open(window.CHAYA.waLink(text), "_blank", "noopener");
    }
  };

  let data = null;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    required.forEach((n) => touched.add(n));
    const ok = required.map(validate).every(Boolean);
    if (!ok) {
      form.classList.remove("is-shaking"); void form.offsetWidth; form.classList.add("is-shaking");
      const first = form.querySelector('[aria-invalid="true"]');
      first && first.focus();
      return;
    }
    data = collect();
    choice.querySelector("[data-name]").textContent = data.nombre.split(" ")[0];
    form.hidden = true;
    choice.hidden = false;
    choice.querySelector("button").focus();
  });

  choice.querySelectorAll("[data-via]").forEach((b) => b.addEventListener("click", () => {
    send(b.dataset.via, data);
    success.querySelector("[data-name]").textContent = data.nombre.split(" ")[0];
    choice.hidden = true;
    success.hidden = false;
    success.focus();
  }));
  choice.querySelector("[data-back]").addEventListener("click", () => {
    choice.hidden = true;
    form.hidden = false;
    form.elements.nombre.focus();
  });

  success.querySelector("[data-reset]").addEventListener("click", () => {
    form.reset();
    touched.clear();
    form.querySelectorAll(".is-valid, .is-invalid").forEach((el) => el.classList.remove("is-valid", "is-invalid"));
    form.querySelectorAll(".field__error").forEach((el) => { el.textContent = ""; });
    [servicio, plazo].forEach(paintSelect);
    if (counter) counter.textContent = "0 / 1200";
    success.hidden = true;
    form.hidden = false;
    form.elements.nombre.focus();
  });
})();
