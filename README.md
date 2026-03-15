# ⚔️ HAGANE

An immersive 3D katana customizer. Explore hand-forged blades through ambient Japanese environments powered by Three.js. 🗡️

---

# ✨ Table of Contents

- [Introduction](#%EF%B8%8F-introduction)
- [Inspiration](#-inspiration)
- [Features](#-features)
- [The Five Environments](#-the-five-environments)
- [Getting Started](#-getting-started)
- [Technologies Used](#-technologies-used)
- [Project Structure](#%EF%B8%8F-project-structure)
- [License](#-license)
- [Contact](#%EF%B8%8F-contact)
- [Author](#-author)

---

## ⛩️ Introduction

Hey 👋🏻, this is **HAGANE** (鋼 — "Steel" in Japanese) — a cinematic single-page experience where you customize a katana in real-time 3D. 🎬 Switch between ambient environments — Sakura, Bamboo, Storm, Ember, Frost — each with its own soundscape, particles, colors and blade lore. 🌸

A loading screen introduces the experience with a samurai silhouette that slashes through to reveal the main scene. 🇯🇵

## 🌠 Inspiration

This project is born from a fascination with Japanese sword-forging tradition ⚔️ and a love for cinematic web experiences 🎥. Inspired by Awwwards-winning websites, the art of the katana, and the serene beauty of Japanese nature 🏯, the goal was to create something immersive, visually stunning, and unforgettable ✨.

## 🐲 Features

- **3D Katana Customizer:** Real-time color modification of blade, pommel, scabbard, handle and guard. 🎮
- **5 Ambient Environments:** Unique gradient backgrounds, floating particles and soundscapes. 🌀
- **Day/Night Modes:** Toggle between dark and light themes, each with different ambient sounds. 🌗
- **Ambient Sound System:** Garden sounds, temple bells, owls, rain — adapted to scene and time of day. 🔊
- **Loading Screen:** HAGANE title with samurai SVG slash animation transition. ⏳
- **Smooth Transitions:** Scene switching with synced color, text and particle transitions. 🔄
- **Post-Processing:** Bloom, vignette for cinematic atmosphere. 🎬
- **Responsive Design:** Adapted for desktop and mobile. 📱

## 🐉 The Five Environments

| Environment | Kanji | Japanese   | Subtitle             |
| ----------- | ----- | ---------- | -------------------- |
| 🌸 Sakura   | 桜刃  | Sakura-Jin | Cherry Blossom Blade |
| 🎋 Bamboo   | 竹風  | Chikufū    | Bamboo Wind          |
| ⛈️ Storm    | 雷鳴  | Raimei     | Thunder Roar         |
| 🔥 Ember    | 焔心  | Enshin     | Ember Heart          |
| ❄️ Frost    | 霜月  | Shimotsuki | Frost Moon           |

## 🦾 Getting Started

1. ⚔️ **Clone:**
   Clone this repository locally with `git clone`.

```bash
git clone [repository-url]
```

2. 🛡️ **Dependencies:**
   Install dependencies with `npm install` or `npm i`.

```bash
npm i
```

3. 🏹 **Launch:**
   Start the project with `npm run dev`.

```bash
npm run dev
```

4. 🌐 **Open:**
   Visit `http://localhost:3000` in your browser.

## 🎴 Technologies Used

- ⚛️ [**Next.js**](https://nextjs.org/) — React framework for production.
- ⚛️ [**React**](https://reactjs.org/) — JavaScript library for building user interfaces.
- 🎲 [**Three.js**](https://threejs.org/) — 3D graphics library for WebGL rendering.
- 🎲 [**React Three Fiber**](https://docs.pmnd.rs/react-three-fiber) — React renderer for Three.js.
- 🎲 [**React Three Drei**](https://github.com/pmndrs/drei) — Useful helpers for R3F.
- 🎲 [**React Three Postprocessing**](https://github.com/pmndrs/react-postprocessing) — Post-processing effects (bloom, vignette).
- 🎬 [**GSAP**](https://greensock.com/gsap/) — A powerful JavaScript animation library.
- 🎨 [**Sass**](https://sass-lang.com/) — CSS extension language for maintainable styles.

---

## 🗂️ Project Structure

```
/
├── public/
│   ├── audio/                       # Ambient sounds (to add)
│   ├── img/                         # Images and textures (to add)
│   └── svg/                         # SVG assets (to add)
├── src/
│   ├── app/
│   │   ├── layout.js                # Root layout + metadata
│   │   └── page.js                  # Main page (ThemeProvider wrapper)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Main_Layout/         # Global UI container
│   │   │   ├── Sword_Title/         # Sword name + kanji display
│   │   │   └── Sword_Description/   # Sword lore text
│   │   ├── three/
│   │   │   ├── Sword_Scene.jsx      # R3F Canvas + scene setup
│   │   │   ├── Sword_Model.jsx      # 3D katana (placeholder geometry)
│   │   │   ├── Particles.jsx        # Floating particle system
│   │   │   ├── Post_Processing.jsx  # Bloom, vignette
│   │   │   └── Scene_Wrapper.jsx    # Dynamic import (ssr: false)
│   │   └── ui/
│   │       ├── Loading_Screen/      # HAGANE intro + samurai slash
│   │       ├── Sound_Toggle/        # Mute/unmute ambient sounds
│   │       ├── Mode_Toggle/         # Dark/light mode switch
│   │       ├── Scene_Switcher/      # Left/right environment navigation
│   │       └── Color_Picker/        # Sword part color customization
│   ├── context/
│   │   ├── ThemeContext.jsx          # Global state (scene, mode, sound, colors)
│   │   └── index.js                 # Export ThemeProvider + useTheme
│   ├── data/
│   │   └── constants.js             # Scenes, sword parts, default colors
│   ├── hooks/                       # Custom React hooks (to add)
│   └── styles/
│       ├── _variables.scss          # SCSS variables
│       ├── themes.scss              # CSS custom properties
│       └── globals.scss             # Global reset + fonts
├── next.config.js
├── jsconfig.json
└── package.json
```

## 🌐 Site URL

You can visit the live site at [https://3d-saber.vercel.app/](https://3d-saber.vercel.app/). 💻

## 🏯 License

This project is not licensed for public use.
All rights reserved. ☠️

---

## 🗺️ Contact

For any inquiries, suggestions, or collaboration opportunities, don't hesitate to contact me. 📜

## 🧑🏻‍💻 Author

Created by TheLeon 🔥.

> "The blade remembers what the hand forgets." — HAGANE ☄️

Thanks for visiting HAGANE! 🩵

Et comme on dit en France : Merci ! 💙🤍❤️
