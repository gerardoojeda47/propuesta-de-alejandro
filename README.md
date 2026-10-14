# 💙 Una Historia Escrita en Azul — Para Mónica Marcela González

Una experiencia romántica digital creada con React, TypeScript, Vite, Tailwind CSS y Framer Motion.

---

## 🚀 Cómo ejecutar el proyecto

```bash
npm install
npm run dev
```

Abre el navegador en `http://localhost:5173`

## 📦 Cómo construir para producción

```bash
npm run build
npm run preview
```

---

## ✏️ Cómo personalizar el contenido

Toda la personalización está centralizada en un solo archivo:

```
src/data/romanticContent.ts
```

Allí puedes cambiar:

- `config.herName` — nombre de ella
- `config.senderName` — **tu nombre** (¡cambia esto!)
- `finalLetterContent.signature` — firma de la carta final
- Todos los textos, poemas, frases y párrafos de cada sección
- Los mensajes de respuesta a la propuesta

---

## 🖼️ Cómo agregar las fotografías

Coloca las imágenes en la carpeta `public/images/` con estos nombres exactos:

```
public/
└── images/
    ├── monica1.jpg   ← Foto principal (grande)
    ├── monica2.jpg   ← Foto vertical con borde luminoso
    ├── monica3.jpg   ← Foto estilo polaroid
    ├── monica4.jpg   ← Foto flotante pequeña
    └── monica5.jpg   ← Foto flotante pequeña
```

- Formatos aceptados: `.jpg`, `.jpeg`, `.png`, `.webp`
- Si no hay fotos, la galería muestra espacios elegantes de demostración
- No hay fotos de personas en el proyecto — debes añadirlas tú

---

## 🎵 Cómo agregar música

Coloca tu archivo de música en:

```
public/music/romantic.mp3
```

- El reproductor aparece en la esquina inferior izquierda
- La música **NO se reproduce automáticamente** — el usuario debe pulsar play
- Si no hay archivo, el botón aparece desactivado
- Usa música libre de derechos (por ejemplo de ccMixter, Free Music Archive, etc.)

---

## 🌐 Despliegue

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

Arrastra la carpeta `dist/` al panel de Netlify, o conecta el repositorio.

### GitHub Pages

1. Agrega `"base": "/nombre-del-repo/"` en `vite.config.ts`
2. Ejecuta `npm run build`
3. Despliega la carpeta `dist/`

---

## 🗂️ Estructura del proyecto

```
src/
├── components/
│   ├── StarField.tsx         — Campo de estrellas animado (canvas)
│   ├── ShootingStars.tsx     — Estrellas fugaces (canvas)
│   ├── BlueParticles.tsx     — Partículas azules interactivas (canvas)
│   ├── CinematicTransition.tsx — Transición cinematográfica
│   ├── RomanticButton.tsx    — Botón con resplandor azul
│   ├── PoemText.tsx          — Texto del poema con animación
│   ├── PhotoGallery.tsx      — Galería artística de fotos
│   ├── MoonWaterScene.tsx    — Escena del lago nocturno (canvas)
│   ├── MusicPlayer.tsx       — Reproductor de música
│   └── ProgressIndicator.tsx — Indicador lateral de progreso
│
├── sections/
│   ├── Hero.tsx              — Portada cinematográfica
│   ├── TimeWithYou.tsx       — Reloj y reflexión sobre el tiempo
│   ├── RealFeelings.tsx      — Corazón de partículas y sentimientos
│   ├── MainPoem.tsx          — Poema principal completo
│   ├── TwoConstellations.tsx — Dos caminos que se encuentran
│   ├── Memories.tsx          — Galería de recuerdos
│   ├── MoonScene.tsx         — Escena cinematográfica del lago y la luna
│   ├── ShootingStar.tsx      — Estrella interactiva
│   ├── Proposal.tsx          — La pregunta principal
│   └── FinalLetter.tsx       — Carta final personalizable
│
├── data/
│   └── romanticContent.ts    — ← EDITA AQUÍ todo el contenido
│
├── App.tsx
├── main.tsx
└── index.css

public/
├── images/                   ← Coloca aquí las fotos (monica1-5.jpg)
└── music/
    └── romantic.mp3          ← Coloca aquí la música
```

---

## 💙 Créditos

Desarrollado con amor, React y estrellas azules.
