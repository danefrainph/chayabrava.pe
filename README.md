# Chaya Brava — Sitio web

Sitio web estático de **Chaya Brava**, agencia peruana de branding, audiovisual y páginas web.
Construido con HTML, CSS y JavaScript puros: sin frameworks, sin dependencias y sin paso de compilación.
El diseño sigue el prototipo definitivo (`prototipe de chaya web`), y sus imágenes y adornos vectoriales se extrajeron de ese PDF.

## Páginas

| Carpeta | Página | Lo interactivo |
|---|---|---|
| `index.html` + `inicio/` | Inicio | Parallax del hero, alpaca que sigue el cursor, contadores, accesos rápidos incas |
| `nosotros/` | Nosotros | Pestañas Misión / Visión / Propósito, valores y Chaya Staff |
| `branding/` | Branding | Cinta de servicios animada, proyectos (`#proyectos`), paquetes (`#paquetes`) |
| `audiovisual/` | Audiovisual | Galería de trabajos (`#galeria`) con visor a pantalla completa (teclado y gesto de deslizar) |
| `paginas-web/` | Páginas Web | Maqueta del hero con movimiento, proyectos y paquetes (`#paquetes`) |
| `contacto/` | Contacto | Formulario "¿Trabajamos juntos?" con validación; al enviar se elige WhatsApp o correo |
| `blog/` | Blog | Artículos con lector en ventana y enlace compartible (`#post-…`) |

En todas las páginas aparece **Challu**, el bot de preguntas frecuentes, encima del botón de WhatsApp.

## Estructura

Cada página vive en su carpeta, con su HTML, su CSS y su JS por separado. Lo compartido está en `assets/`.

```
chaya-brava/
├── index.html                 ← Inicio (debe estar en la raíz)
├── inicio/      inicio.css, inicio.js
├── nosotros/    index.html, nosotros.css, nosotros.js
├── branding/    index.html, branding.css, branding.js
├── audiovisual/ index.html, audiovisual.css, audiovisual.js
├── paginas-web/ index.html, paginas-web.css, paginas-web.js
├── contacto/    index.html, contacto.css, contacto.js
├── blog/        index.html, blog.css, blog.js
├── favicon.svg, robots.txt, sitemap.xml
└── assets/
    ├── css/
    │   ├── base.css           ← colores, tipografías, header, footer, botones, texturas y componentes compartidos
    │   └── challu.css         ← aspecto del bot Challu
    ├── js/
    │   ├── main.js            ← header, menú móvil, animaciones, contadores, datos de contacto
    │   └── challu.js          ← bot Challu: preguntas, respuestas y palabras clave
    ├── fonts/                 ← Answer y Nexa Slab Demo (woff + original)
    └── img/
        ├── marca/             ← logo (blanco y negro) en SVG, favicon, imagen para redes
        ├── fondos/            ← Andes, Machu Picchu, Vinicunca, montañas y muro inca
        ├── personajes/        ← alpaca VR, alpaca con lentes, cámara andina, inca foco y Challu
        ├── proyectos/         ← Sinchi, El Taita, Tiendas Chan, Selecto Consultores, FS Farmacia…
        ├── servicios/         ← producción de video, boceto andino, estudio creativo
        ├── equipo/            ← fotos del Chaya Staff
        ├── iconos/            ← fuego, llama y manos (Lo que nos define)
        ├── grecas/            ← glifos incas de los títulos y del CTA (SVG)
        └── texturas/          ← ladrillo, cortina, patrón andino y bandas de greca (SVG)
```

## Ver el sitio en tu computadora

Abre `index.html` con doble clic, o (recomendado) levanta un servidor local:

```bash
cd chaya-brava
python3 -m http.server 8000
# abre http://localhost:8000
```

## Publicar

Al ser estático, sube la carpeta tal cual a cualquier hosting: Cloudflare Pages, Netlify, Vercel, GitHub Pages o tu hosting con cPanel.
Las páginas quedan en direcciones limpias: `chayabrava.pe/nosotros/`, `chayabrava.pe/branding/`, etc.

## Editar

- **Bot Challu**: las preguntas y respuestas están al inicio de `assets/js/challu.js` (`FAQ` y `EXTRA`). Las palabras clave que reconoce cuando el visitante escribe están en `W`.
- **WhatsApp y correo**: en `assets/js/main.js` (`window.CHAYA`) y en los enlaces `tel:` / `mailto:` de cada página.
- **Redes sociales**: las URL del pie de página son provisionales (`facebook.com/chayabrava`, etc.). Cámbialas en cada HTML, buscando `chayabrava"`.
- **Dominio**: `https://chayabrava.pe` aparece en las etiquetas `canonical`/`og:` de cada página, en `robots.txt` y en `sitemap.xml`.
- **Paquetes**: cada tarjeta enlaza al formulario con el paquete elegido (`contacto/index.html?servicio=branding&plan=basico`), y el formulario lo escribe en el mensaje.
- **Fotos del staff**: Paul Roque y Dan Efraín usan por ahora la llama de reemplazo; pon sus fotos en `assets/img/equipo/` y cámbialas en `nosotros/index.html`.

## Tipografías

- **Answer** (títulos). Se le añadieron tildes, ñ, ü, ¿, ¡, guion, + y / porque la fuente original no los trae.
- **Nexa Slab Demo** (textos). La versión *demo* reemplaza algunos signos (`: + - @ / ¿ ¡ "`) por un aviso "available in the full version". Para evitarlo, `base.css` limita la fuente a letras y números con `unicode-range` y esos signos se muestran con la fuente de respaldo.
  **Para uso comercial, compra la licencia completa de Nexa Slab** y reemplaza los archivos en `assets/fonts/`; luego puedes quitar el `unicode-range`.

## Calidad

- Diseño responsive (móvil, tablet, escritorio) y menú móvil a pantalla completa.
- Accesibilidad: enlace "saltar al contenido", foco visible, ARIA en pestañas, ventanas y chat, respeto a `prefers-reduced-motion`.
- Rendimiento: imágenes WebP optimizadas (con versión móvil en los fondos grandes), carga diferida, fuentes precargadas, JS sin dependencias.
- SEO: títulos y descripciones por página, Open Graph, `sitemap.xml` y `robots.txt`.
