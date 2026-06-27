# Expertos Tandil — Guía de Profesionales

## Estructura del proyecto

```
expertos-tandil/
├── profesionales.json   ← ÚNICO archivo que editás para agregar/modificar profesionales
├── build.js             ← script que genera todo el sitio
├── styles.css           ← estilos globales
├── main.js              ← sidebar + carrusel automático
├── logo.png             ← logo con fondo transparente
├── sitemap.xml          ← para Google Search Console
├── robots.txt           ← para crawlers
└── dist/                ← carpeta generada (esto se sube a Vercel/Netlify)
    ├── index.html
    ├── plomeros-tandil.html
    ├── electricistas-tandil.html
    ├── construccion-tandil.html
    ├── arquitectos-tandil.html
    ├── zingueros-tandil.html
    ├── herreros-tandil.html
    ├── carpinteros-tandil.html
    └── paisajistas-tandil.html
```

---

## Cómo agregar un profesional nuevo

1. Abrí `profesionales.json`
2. Agregá un objeto al array con esta estructura:

```json
{
  "nombre": "Juan Pérez",
  "titulo": "Plomero matriculado",
  "rubro": "plomeria",
  "emoji": "🔧",
  "especialidades": ["Instalaciones", "Destapes", "Urgencias"],
  "descripcion": "Descripción del profesional...",
  "tel": "2494XXXXXX",
  "instagram": "juanperez_plomero",
  "pagina": "plomeros-tandil"
}
```

3. Ejecutá en la terminal:
```bash
node build.js
```

4. Subí la carpeta `/dist` a Vercel o Netlify.

---

## Rubros disponibles (campo "rubro")

| Valor          | Página generada                  | Categoría                        |
|----------------|----------------------------------|----------------------------------|
| plomeria       | plomeros-tandil.html             | Plomero / Gasista                |
| electricidad   | electricistas-tandil.html        | Electricista                     |
| albanil        | albaniles-tandil.html            | Albañil                          |
| arquitectura   | arquitectos-tandil.html          | Arquitecto                       |
| zingueria      | zingueros-tandil.html            | Zinguero                         |
| paisajismo     | paisajistas-tandil.html          | Paisajista                       |
| techista       | techistas-tandil.html            | Techista                         |
| pintura        | pintores-tandil.html             | Pintor                           |
| mmo            | maestros-mayor-tandil.html       | Maestro Mayor de Obra            |
| carpinteria    | carpinteros-tandil.html          | Carpintero                       |
| herreria       | herreros-tandil.html             | Herrero                          |
| durleria       | durleros-tandil.html             | Durlero                          |
| steelframing   | steeleros-tandil.html            | Steel Framing                    |
| torneria       | torneros-tandil.html             | Tornero                          |
| vidrieria      | vidrieros-tandil.html            | Vidriero                         |
| herreria_inox  | herreria-inox-tandil.html        | Herrería especial acero inox     |

---

## Cómo agregar un rubro nuevo

1. En `build.js`, buscá el array `RUBROS` y agregá:
```js
{ key:'nuevo_rubro', slug:'nuevo-rubro-tandil', label:'Nuevo Rubro', emoji:'🔨',
  titulo:'Nuevo Rubro en Tandil', seo:'Descripción SEO del rubro...' }
```
2. En `sitemap.xml`, agregá la URL nueva.
3. Ejecutá `node build.js`.

---

## Cómo agregar una publicidad

En `build.js`, buscá el array `PUBS` y agregá:
```js
{ emoji:'🏪', nombre:"Nombre del comercio", desc:"Descripción breve" }
```

---

## Deploy en Vercel (drag & drop)

1. Entrá a [vercel.com](https://vercel.com)
2. "Add New Project" → "Deploy from folder"
3. Arrastrá la carpeta `/dist`
4. Listo. Vercel te da una URL en segundos.

Para conectar el dominio `tandilexpertos.com.ar`:
- En Vercel: Settings → Domains → agregar dominio
- En NIC Argentina: configurar los nameservers de Vercel

---

## SEO — Checklist post-lanzamiento

- [ ] Registrar sitio en [Google Search Console](https://search.google.com/search-console)
- [ ] Subir `sitemap.xml` en Search Console
- [ ] Crear [Google Business Profile](https://business.google.com) para Expertos Tandil
- [ ] Pedir a cada profesional que mencione el sitio en su Instagram

---

## Requisitos

- Node.js 18+
- No requiere ningún framework ni dependencia npm
