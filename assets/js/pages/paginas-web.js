/* ==========================================================================
   PÁGINAS WEB — planificador de proyecto web
   Los plazos son referenciales: ajusta "data-weeks" en el HTML si cambian.
   ========================================================================== */
(() => {
  "use strict";

  const form = document.getElementById("planner");
  if (!form) return;
  const range = form.querySelector("#paginas");
  const rangeOut = form.querySelector("#paginas-out");
  const out = (k) => form.querySelector(`[data-out="${k}"]`);

  const read = () => {
    const tipo = form.querySelector('input[name="tipo"]:checked');
    const extras = [...form.querySelectorAll('input[name="extras"]:checked')];
    const pages = Number(range.value);
    // Base del tipo + tiempo extra por páginas por encima de 5 + extras
    let weeks = Number(tipo.dataset.weeks) + Math.max(0, pages - 5) * 0.25;
    extras.forEach((e) => { weeks += Number(e.dataset.weeks); });
    const min = Math.max(1, Math.round(weeks));
    const max = min + (weeks > 4 ? 2 : 1);
    return { tipo, extras, pages, min, max };
  };

  const render = () => {
    const { tipo, extras, pages, min, max } = read();
    const pTxt = `${pages} ${pages === 1 ? "página" : "páginas"}`;
    rangeOut.textContent = pTxt;
    range.style.setProperty("--p", `${((pages - 1) / 19) * 100}%`);
    range.setAttribute("aria-valuetext", pTxt);
    out("tipo").textContent = tipo.dataset.label;
    out("paginas").textContent = pages;
    out("extras").textContent = extras.length ? extras.map((e) => e.dataset.label).join(", ") : "Ninguno";
    out("semanas").textContent = `${min} a ${max} semanas`;
    out("bar").style.width = `${Math.min(100, (max / 14) * 100)}%`;
    out("contact").href = `contacto.html?servicio=web&tipo=${encodeURIComponent(tipo.value)}`;
  };

  form.addEventListener("input", render);
  form.addEventListener("change", render);
  render();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const { tipo, extras, pages, min, max } = read();
    const msg = [
      "Hola Chaya Brava, quiero cotizar una página web:",
      `• Tipo: ${tipo.dataset.label}`,
      `• Páginas: ${pages}`,
      `• Extras: ${extras.length ? extras.map((x) => x.dataset.label).join(", ") : "ninguno"}`,
      `• Plazo referencial: ${min} a ${max} semanas`,
    ].join("\n");
    window.open(window.CHAYA.waLink(msg), "_blank", "noopener");
  });
})();
