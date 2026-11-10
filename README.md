# Chaya Brava — Sitio web

Sitio web estático de **Chaya Brava**, agencia peruana de branding, audiovisual y páginas web.
Construido con HTML, CSS y JavaScript puros: sin frameworks, sin dependencias y sin paso de compilación.

## Páginas

| Archivo | Página | Lo interactivo |
|---|---|---|
| `index.html` | Inicio | Parallax del hero, alpaca que sigue el cursor, contadores, carrusel de proyectos arrastrable |
| `nosotros.html` | Nosotros | Pestañas Misión / Visión / Propósito, clientes, blog con lector de artículos (`#blog`) |
| `branding.html` | Branding | Casos (`#casos`), paletas "Colores del Perú" que se copian con un clic, preguntas frecuentes |
| `audiovisual.html` | Audiovisual | Galería con filtros y visor a pantalla completa (teclado y gesto de deslizar) |
| `paginas-web.html` | Páginas Web | Planificador de proyecto con plazo referencial y envío por WhatsApp, planes |
| `contacto.html` | Contacto | Formulario con validación que envía por WhatsApp o por correo |

## Estructura

```
chaya-brava/
├── index.html, nosotros.html, branding.html, audiovisual.html, paginas-web.html, contacto.html
├── favicon.svg, robots.txt, sitemap.xml
└── assets/
    ├── css/
    │   ├── base.css            ← variables, tipografías, header, footer, componentes compartidos
    │   └── pages/*.css         ← estilos propios de cada página
    ├── js/
    │   ├── main.js             ← header, menú móvil, animaciones, contadores, WhatsApp, acordeón
    │   └── pages/*.js          ← lógica propia de cada página
    ├── fonts/                  ← Answer y Nexa Slab Demo (woff + original)
    └── img/
        ├── hero/               ← fondo andino y alpaca (con transparencia)
        ├── marca/              ← logo (blanco y negro) en SVG, favicon, imagen para redes
        ├── proyectos/          ← Sinchi, El Taita, web, revista
        ├── servicios/          ← fotos de estudio y proceso
        └── texturas/           ← ladrillo, muro inca, greca y patrón andino (SVG)
```

## Ver el sitio en tu computadora

Abre `index.html` con doble clic, o (recomendado) levanta un servidor local:

```bash
cd chaya-brava
python -m http.server 8000
# abre http://localhost:8000
```

## Publicar

Al ser estático, sube la carpeta tal cual a cualquier hosting: Cloudflare Pages, Netlify, Vercel, GitHub Pages o tu hosting con cPanel.
En Cloudflare Pages: *Create project → Upload assets* (o conecta el repositorio) sin comando de build y con la carpeta raíz como salida.

## Datos que debes revisar antes de publicar

- **Redes sociales**: las URL del pie de página son provisionales (`facebook.com/chayabrava`, etc.). Cámbialas en cada HTML, buscando `chayabrava"`.
- **WhatsApp y correo**: están en `assets/js/main.js` (`window.CHAYA`) y en los enlaces `tel:` / `mailto:` de cada página.
- **Dominio**: `https://chayabrava.pe` aparece en las etiquetas `canonical`/`og:` de cada página, en `robots.txt` y en `sitemap.xml`.
- **Plazos del planificador web**: cada opción tiene un atributo `data-weeks` en `paginas-web.html`.
- **Textos de ejemplo**: casos, artículos del blog y preguntas frecuentes son textos base; ajústalos a la información real de la agencia.

## Tipografías

- **Answer** (títulos). Se le añadieron tildes, ñ, ü, ¿, ¡, guion, + y / porque la fuente original no los trae.
- **Nexa Slab Demo** (textos). La versión *demo* reemplaza algunos signos (`: + - @ / ¿ ¡ "`) por un aviso "available in the full version". Para evitarlo, `base.css` limita la fuente a letras y números con `unicode-range` y esos signos se muestran con la fuente de respaldo.
  **Para uso comercial, compra la licencia completa de Nexa Slab** y reemplaza los archivos en `assets/fonts/`; luego puedes quitar el `unicode-range`.

## Calidad

- Diseño responsive (móvil, tablet, escritorio) y menú móvil a pantalla completa.
- Accesibilidad: enlace "saltar al contenido", foco visible, ARIA en pestañas, modales y carrusel, respeto a `prefers-reduced-motion`.
- Rendimiento: imágenes WebP optimizadas, carga diferida, fuentes precargadas, JS sin dependencias.
- SEO: títulos y descripciones por página, Open Graph, `sitemap.xml` y `robots.txt`.
