// ════════════════════════════════════════════
//  build.js — Profesionales Tandil
//  Uso: node build.js
//  Genera todos los HTML desde profesionales.json
// ════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

// ── Cargar datos ──────────────────────────────
const profesionales = JSON.parse(fs.readFileSync('profesionales.json', 'utf8')).filter(p => p.activo !== false);
const OUT           = path.join(__dirname, 'dist');

// Logo SVG inline — sin dependencia de archivo externo
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 196 44" height="40" aria-label="Profesionales Tandil" style="display:block">
  <polygon points="22,3 39,22 22,41 5,22" fill="none" stroke="#D4A017" stroke-width="1.8"/>
  <polygon points="22,12 31,22 22,32 13,22" fill="#B8860B" fill-opacity="0.32"/>
  <text x="47" y="18" font-family="'Helvetica Neue',Arial,sans-serif" font-size="8.5" font-weight="700" letter-spacing="2.6" fill="rgba(255,255,255,0.52)">PROFESIONALES</text>
  <text x="46" y="39" font-family="Georgia,'Times New Roman',serif" font-size="22" font-weight="700" letter-spacing="0.5" fill="#D4A017">Tandil</text>
</svg>`;

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

// ── Copiar assets estáticos ───────────────────
['styles.css', 'main.js', 'sitemap.xml', 'robots.txt'].forEach(f => {
  if (fs.existsSync(f)) fs.copyFileSync(f, path.join(OUT, f));
});

// Copiar carpeta fotos/ a dist/fotos/
const FOTOS_SRC = path.join(__dirname, 'fotos');
const FOTOS_OUT = path.join(OUT, 'fotos');
if (fs.existsSync(FOTOS_SRC)) {
  if (!fs.existsSync(FOTOS_OUT)) fs.mkdirSync(FOTOS_OUT);
  fs.readdirSync(FOTOS_SRC).forEach(f => {
    if (f !== '.gitkeep') fs.copyFileSync(path.join(FOTOS_SRC, f), path.join(FOTOS_OUT, f));
  });
}

// ── Rubros definidos ─────────────────────────
const RUBROS = [
  { key:'plomeria',     slug:'plomeros-tandil',       label:'Plomeros / Gasistas', lucide:'wrench',           titulo:'Plomeros y Gasistas en Tandil',           seo:'Plomeros y gasistas habilitados en Tandil. Instalaciones, destapes, gas natural y urgencias 24 hs.' },
  { key:'electricidad', slug:'electricistas-tandil',  label:'Electricistas',       lucide:'zap',              titulo:'Electricistas en Tandil',                 seo:'Electricistas matriculados en Tandil. Instalaciones, tableros y certificaciones.' },
  { key:'albanil',      slug:'albaniles-tandil',      label:'Albañiles',           lucide:'hammer',           titulo:'Albañiles en Tandil',                     seo:'Albañiles en Tandil. Construcción general, revoques, contrapisos y reformas.' },
  { key:'arquitectura', slug:'arquitectos-tandil',    label:'Arquitectos',         lucide:'drafting-compass', titulo:'Arquitectos en Tandil',                   seo:'Arquitectos en Tandil. Diseño, planos y dirección de obra.' },
  { key:'zingueria',    slug:'zingueros-tandil',      label:'Zingueros',           lucide:'home',             titulo:'Zingueros en Tandil',                     seo:'Zingueros en Tandil. Techos, canaletas e impermeabilización.' },
  { key:'paisajismo',   slug:'paisajistas-tandil',    label:'Paisajistas',         lucide:'leaf',             titulo:'Paisajistas en Tandil',                   seo:'Paisajistas en Tandil. Diseño de jardines y mantenimiento de espacios verdes.' },
  { key:'techista',     slug:'techistas-tandil',      label:'Techistas',           lucide:'triangle',         titulo:'Techistas en Tandil',                     seo:'Techistas en Tandil. Techos de tejas, chapa, losas e impermeabilización de cubiertas.' },
  { key:'pintura',      slug:'pintores-tandil',       label:'Pintores',            lucide:'paintbrush',       titulo:'Pintores en Tandil',                      seo:'Pintores profesionales en Tandil. Pintura interior, exterior, texturas y revestimientos decorativos.' },
  { key:'mmo',          slug:'maestros-mayor-tandil', label:'Maestro Mayor',       lucide:'hard-hat',         titulo:'Maestros Mayor de Obra en Tandil',        seo:'Maestros Mayor de Obra en Tandil. Dirección técnica, obra nueva, ampliaciones y certificaciones.' },
  { key:'carpinteria',  slug:'carpinteros-tandil',    label:'Carpinteros',         lucide:'axe',              titulo:'Carpinteros en Tandil',                   seo:'Carpinteros en Tandil. Muebles a medida, aberturas y reparaciones.' },
  { key:'herreria',     slug:'herreros-tandil',       label:'Herreros',            lucide:'anvil',            titulo:'Herreros en Tandil',                      seo:'Herreros en Tandil. Rejas, portones y estructuras metálicas a medida.' },
  { key:'durleria',     slug:'durleros-tandil',       label:'Durleros',            lucide:'layers',           titulo:'Durleros en Tandil',                      seo:'Durleros en Tandil. Tabiques de drywall, sistemas en seco y cielorrasos de yeso.' },
  { key:'steelframing', slug:'steeleros-tandil',      label:'Steel Framing',       lucide:'box',              titulo:'Steel Framing en Tandil',                 seo:'Constructores en Steel Framing en Tandil. Viviendas y ampliaciones en construcción industrializada.' },
  { key:'torneria',     slug:'torneros-tandil',       label:'Torneros',            lucide:'settings',         titulo:'Torneros en Tandil',                      seo:'Torneros en Tandil. Mecanizado de precisión, torno CNC y piezas metálicas a medida.' },
  { key:'vidrieria',    slug:'vidrieros-tandil',      label:'Vidrieros',           lucide:'gem',              titulo:'Vidrieros en Tandil',                     seo:'Vidrieros en Tandil. Vidrios templados, espejos, doble vidriado hermético y aberturas de aluminio.' },
];

// Mapa rubro → ícono Lucide para lookup rápido
const RUBRO_ICON = {};
RUBROS.forEach(r => { RUBRO_ICON[r.key] = r.lucide; });

// Opciones del select de rubros para el modal
const RUBRO_OPTIONS_HTML = RUBROS.map(r => `<option value="${r.label}">${r.label}</option>`).join('\n          ');

// Genera etiqueta Lucide con trazo fino
function lucideIcon(name, size, color) {
  return `<i data-lucide="${name}" style="width:${size}px;height:${size}px;stroke:${color};stroke-width:1.5;fill:none;display:inline-flex;vertical-align:middle"></i>`;
}

// ── SVG íconos ───────────────────────────────
const WA_SVG = `<svg style="width:15px;height:15px;fill:currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.549 4.107 1.51 5.833L.057 23.25a.75.75 0 0 0 .916.916l5.453-1.456A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.95-1.354l-.355-.211-3.676.982.997-3.607-.232-.371A9.715 9.715 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>`;
const IG_SVG = `<svg style="width:15px;height:15px;fill:currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;

// ── Helpers ───────────────────────────────────
function buildNav(currentSlug) {
  let html = `<a class="nav-item${currentSlug === 'index' ? ' activo' : ''}" href="index.html" title="Todos">${lucideIcon('layout-grid', 18, 'currentColor')}<span>Todos</span></a>\n`;
  RUBROS.forEach(r => {
    const activo = r.slug === currentSlug ? ' activo' : '';
    html += `<a class="nav-item${activo}" href="${r.slug}.html" title="${r.label}">${lucideIcon(r.lucide, 18, 'currentColor')}<span>${r.label}</span></a>\n`;
  });
  return html;
}

function buildFicha(p) {
  const icon   = lucideIcon(RUBRO_ICON[p.rubro] || 'tool', 20, 'var(--dorado)');
  const tags   = p.especialidades.map(e => `<span class="tag">${e}</span>`).join('');
  const avatar = p.foto
    ? `<img class="ficha-foto" src="fotos/${p.foto}" alt="${p.nombre}" loading="lazy">`
    : icon;
  return `
    <article class="ficha" itemscope itemtype="https://schema.org/LocalBusiness">
      <div class="ficha-inner">
        <div class="ficha-top">
          <div class="ficha-avatar${p.foto ? ' ficha-avatar--foto' : ''}">${avatar}</div>
          <div>
            <div class="ficha-nombre" itemprop="name">${p.nombre}</div>
            <div class="ficha-titulo">${p.titulo}</div>
          </div>
        </div>
        <p class="ficha-desc" itemprop="description">${p.descripcion}</p>
        <div class="ficha-btns">
          <a class="btn-wa" href="https://wa.me/549${p.tel}?text=${encodeURIComponent(`Hola ${p.nombre}, lo contacto a través de Profesionales Tandil. Me gustaría hacerle una consulta.`)}" target="_blank" title="WhatsApp ${p.nombre}">${WA_SVG} WhatsApp</a>
          <a class="btn-ig" href="https://instagram.com/${p.instagram}" target="_blank" title="Instagram ${p.nombre}">${IG_SVG} Instagram</a>
        </div>
      </div>
    </article>`;
}

function buildCarrusel() {
  const destacados = RUBROS.map(r => profesionales.find(p => p.rubro === r.key)).filter(Boolean);
  return destacados.map(p => {
    const icon = lucideIcon(RUBRO_ICON[p.rubro] || 'tool', 24, 'var(--blanco)');
    return `
    <div class="carrusel-slide">
      <div class="carrusel-icon">${icon}</div>
      <div class="carrusel-nombre">${p.nombre}</div>
      <div class="carrusel-rubro">${p.titulo}</div>
      <div class="carrusel-esp">${p.especialidades.join(' · ')}</div>
      <a class="carrusel-cta" href="https://wa.me/549${p.tel}?text=${encodeURIComponent(`Hola ${p.nombre}, lo contacto a través de Profesionales Tandil. Me gustaría hacerle una consulta.`)}" target="_blank">${WA_SVG} Escribir por WhatsApp</a>
    </div>`;
  }).join('');
}

function buildSchemaItems(lista) {
  return lista.map((p, i) => `{
    "@type":"ListItem","position":${i + 1},
    "item":{"@type":"LocalBusiness","name":"${p.nombre}","telephone":"+549${p.tel}",
    "address":{"@type":"PostalAddress","addressLocality":"Tandil","addressRegion":"Buenos Aires","addressCountry":"AR"}}
  }`).join(',\n');
}

function buildModal() {
  return `
<div id="modal-registro" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-titulo" aria-hidden="true">
  <div class="modal-card">
    <button class="modal-close" onclick="cerrarModal()" aria-label="Cerrar">${lucideIcon('x', 18, 'currentColor')}</button>
    <div class="modal-head">
      <div class="modal-badge">${lucideIcon('user-plus', 24, 'var(--dorado)')}</div>
      <h2 id="modal-titulo" class="modal-titulo">Sumá tu ficha</h2>
      <p class="modal-sub">Completá tus datos y te contactamos para publicar tu perfil sin costo.</p>
    </div>
    <form id="form-registro" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" novalidate>
      <!-- Honeypot anti-spam -->
      <input type="text" name="_gotcha" style="display:none;position:absolute" tabindex="-1" autocomplete="off" aria-hidden="true">
      <input type="hidden" name="_subject" value="Nueva solicitud — Profesionales Tandil">
      <div class="form-group">
        <label for="f-nombre">Nombre completo <span class="req">*</span></label>
        <input type="text" id="f-nombre" name="nombre" required minlength="3" maxlength="80" autocomplete="name" placeholder="Ej: Carlos Méndez">
      </div>
      <div class="form-group">
        <label for="f-rubro">Rubro <span class="req">*</span></label>
        <select id="f-rubro" name="rubro" required>
          <option value="">— Seleccioná tu rubro —</option>
          ${RUBRO_OPTIONS_HTML}
          <option value="Otro">Otro</option>
        </select>
      </div>
      <div class="form-group">
        <label for="f-tel">WhatsApp <span class="req">*</span></label>
        <input type="tel" id="f-tel" name="whatsapp" required maxlength="20" autocomplete="tel" placeholder="2494 123456">
      </div>
      <div class="form-group">
        <label for="f-esp">Especialidades <span class="req">*</span></label>
        <input type="text" id="f-esp" name="especialidades" required maxlength="120" placeholder="Ej: Destapes, gas, urgencias 24 hs">
      </div>
      <div class="form-group">
        <label for="f-desc">Descripción <span class="req">*</span></label>
        <textarea id="f-desc" name="descripcion" required minlength="20" maxlength="300" rows="3" placeholder="Contanos brevemente quién sos y qué servicio ofrecés en Tandil…"></textarea>
        <span class="form-contador" id="desc-count">0 / 300</span>
      </div>
      <p class="form-aviso">* Campos obligatorios · Tu información es privada y no se comparte con terceros.</p>
      <button type="submit" class="btn-enviar">${lucideIcon('send', 15, 'currentColor')} Enviar solicitud</button>
      <button type="button" class="btn-cancelar" onclick="cerrarModal()">Cancelar</button>
    </form>
    <div id="form-exito" class="form-exito" hidden>
      ${lucideIcon('check-circle', 48, 'var(--dorado)')}
      <h3>¡Solicitud recibida!</h3>
      <p>Nos ponemos en contacto dentro de las 48 hs para publicar tu ficha.</p>
      <button class="btn-cerrar-exito" onclick="cerrarModal()">Cerrar</button>
    </div>
  </div>
</div>`;
}

function buildFooterLinks() {
  return RUBROS.map(r => `<a href="${r.slug}.html">${r.label}</a>`).join('');
}

function wrapPage({ title, metaDesc, canonical, schema, h1hidden, nav, main }) {
  return `<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${metaDesc}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<link rel="canonical" href="https://www.profesionalestrandil.com.ar/${canonical}">
<meta name="geo.region" content="AR-B">
<meta name="geo.placename" content="Tandil, Buenos Aires, Argentina">
<meta name="geo.position" content="-37.3217;-59.1332">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${metaDesc}">
<meta property="og:url" content="https://www.profesionalestrandil.com.ar/${canonical}">
<meta property="og:locale" content="es_AR">
<script type="application/ld+json">${schema}</script>
<link rel="stylesheet" href="styles.css">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
</head>
<body>
<h1 style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap">${h1hidden}</h1>
<header>
  <a href="index.html">${LOGO_SVG}</a>
  <div class="header-right">${lucideIcon('map-pin', 13, 'currentColor')} Tandil, Buenos Aires</div>
  <button class="hamburger" onclick="toggleSidebar()"><span></span><span></span><span></span></button>
</header>
<nav class="sidebar" id="sidebar">
  <div class="sidebar-label">Rubros</div>
  ${nav}
</nav>
<div class="overlay" id="overlay" onclick="toggleSidebar()"></div>
${main}
<main class="contenido" id="contenido"></main>
<div class="banner">
  <div><h2>¿Sos profesional en Tandil?</h2><p>Sumá tu ficha y empezá a recibir consultas hoy mismo.</p></div>
  <button class="btn-cta" type="button" onclick="abrirModal()">Quiero aparecer</button>
</div>
<footer>
  <a href="index.html" class="footer-logo">${LOGO_SVG}</a>
  <p><strong>Profesionales Tandil</strong> · Guía de Profesionales · Tandil, Buenos Aires · © 2025</p>
  <div class="footer-links">${buildFooterLinks()}</div>
</footer>
<script src="main.js"></script>
<script>lucide.createIcons();</script>
${buildModal()}
</body>
</html>`;
}


// ── GENERAR INDEX ─────────────────────────────
function buildIndex() {
  const fichas = profesionales.map(buildFicha).join('');
  const schema = JSON.stringify({
    "@context":"https://schema.org","@type":"ItemList",
    "name":"Profesionales en Tandil",
    "itemListElement": profesionales.map((p,i) => ({
      "@type":"ListItem","position":i+1,
      "item":{"@type":"LocalBusiness","name":p.nombre,"telephone":`+549${p.tel}`,
      "address":{"@type":"PostalAddress","addressLocality":"Tandil","addressRegion":"Buenos Aires","addressCountry":"AR"}}
    }))
  });

  const mainDirect = `
<section class="hero">
  <p class="hero-eyebrow">Guía de Profesionales · Tandil</p>
  <h1>El profesional que necesitás,<br><em>a un mensaje.</em></h1>
  <p class="hero-copy">Buscamos que puedas encontrar el mejor servicio y la confianza absoluta para tus necesidades.</p>
  <p class="hero-copy">Los profesionales que se encuentran en este sitio son de absoluta confianza y responsabilidad.</p>
  <p class="hero-copy">Vinimos a ayudarte a tener todo lo que necesitás, en un mismo lugar.</p>
</section>
<div class="carrusel-wrap">
  <div class="carrusel-titulo">Profesionales destacados</div>
  <div class="carrusel" id="carrusel">
    <div class="carrusel-track" id="carrusel-track">${buildCarrusel()}</div>
  </div>
</div>`;

  const html = wrapPage({
    title: 'Profesionales Tandil | Plomeros, Electricistas, Albañiles y Profesionales en Tandil',
    metaDesc: 'Profesionales Tandil: guía de profesionales verificados en Tandil. Plomeros, electricistas, albañiles, arquitectos, techistas, pintores, carpinteros, herreros y más.',
    canonical: '',
    schema,
    h1hidden: 'Profesionales Tandil – Plomeros, Electricistas, Albañiles, Arquitectos, Techistas, Pintores, Herreros, Carpinteros, Durleros, Steeleros, Torneros, Vidrieros y más en Tandil, Buenos Aires',
    nav: buildNav('index'),
    main: mainDirect,
  }).replace('<main class="contenido" id="contenido"></main>',
    `<main class="contenido">
      <div class="contenido-header-row">
        <div>
          <div class="contenido-titulo">Todos los profesionales</div>
          <div class="contenido-sub">${profesionales.length} profesionales verificados en Tandil</div>
        </div>
        <div class="buscador-wrap">
          <div class="buscador">
            ${lucideIcon('search', 18, 'var(--texto-suave)')}
            <input type="search" id="buscador-input" placeholder="Buscar por nombre, oficio o descripción…" autocomplete="off" spellcheck="false">
          </div>
        </div>
      </div>
      <div class="grid" id="grid-profesionales">${fichas}</div>
      <p class="sin-resultados" id="sin-resultados" hidden>No encontramos resultados para "<strong id="sin-q"></strong>". Probá con otra palabra.</p>
    </main>`);

  fs.writeFileSync(path.join(OUT, 'index.html'), html);
  console.log(`✓ index.html`);
}

// ── GENERAR PÁGINAS POR RUBRO ─────────────────
function buildRubroPage(rubro) {
  const lista  = profesionales.filter(p => p.rubro === rubro.key);
  const fichas = lista.map(buildFicha).join('');
  const schema = JSON.stringify({
    "@context":"https://schema.org","@type":"ItemList",
    "name": rubro.titulo,
    "description": rubro.seo,
    "itemListElement": lista.map((p,i) => ({
      "@type":"ListItem","position":i+1,
      "item":{"@type":"LocalBusiness","name":p.nombre,"telephone":`+549${p.tel}`,
      "address":{"@type":"PostalAddress","addressLocality":"Tandil","addressRegion":"Buenos Aires","addressCountry":"AR"}}
    }))
  });

  const heroSection = `
<section class="hero">
  <p class="hero-eyebrow">Guía de Profesionales · Tandil</p>
  <h1>${rubro.label}<br><em>en Tandil</em></h1>
  <p class="hero-copy">${rubro.seo}<br>Todos verificados. Contacto directo por WhatsApp.</p>
</section>`;

  const html = wrapPage({
    title: `${rubro.titulo} | Profesionales Tandil`,
    metaDesc: rubro.seo,
    canonical: `${rubro.slug}.html`,
    schema,
    h1hidden: `${rubro.titulo} – Profesionales Tandil – Guía de Profesionales en Tandil`,
    nav: buildNav(rubro.slug),
    main: heroSection,
  }).replace('<main class="contenido" id="contenido"></main>',
    `<main class="contenido">
      <div class="contenido-titulo">${rubro.titulo}</div>
      <div class="contenido-sub">${lista.length} profesionales verificados en Tandil</div>
      <div class="grid">${fichas}</div>
    </main>`);

  fs.writeFileSync(path.join(OUT, `${rubro.slug}.html`), html);
  console.log(`✓ ${rubro.slug}.html — ${lista.length} profesionales`);
}

// ── EJECUTAR ──────────────────────────────────
console.log('\n🔨 Generando sitio Profesionales Tandil...\n');
buildIndex();
RUBROS.forEach(buildRubroPage);
console.log(`\n✅ Sitio generado en /dist — ${profesionales.length} profesionales en total\n`);
console.log('📋 Próximos pasos:');
console.log('   1. Editá profesionales.json con los datos reales');
console.log('   2. Ejecutá: node build.js');
console.log('   3. Subí la carpeta /dist a Vercel o Netlify\n');
