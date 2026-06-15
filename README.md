# dalapto.github.io

This is the repository for my personal portfolio website [dalapto.github.io](https://dalapto.github.io)

### Here be dragons 🐉

This is still very much in progress...

...but you're very welcome to have a look around! 🖥️

## Tech stack

- **React 18** + **TypeScript** via **Vite**
- **MUI** (Material UI v5) for UI primitives and icons
- **react-spring** for page transitions and parallax
- **react-router-dom v6** for client-side routing
- **gh-pages** for deployment to GitHub Pages

## Repo structure

```
src/
├── 📄 App.tsx                     # Root
│
├── 📁 pages/
│   ├── 🏠 Home/
│   ├── 🙋 About/                  # Bio
│   ├── 🛠️ Projects/
│   │   ├── 🗑️ Litter/             # Location-based social media app (uni project)
│   │   ├── ⚔️ m2tw/               # Medieval 2: Total War extended
│   │   └── 🏰 RON/                # Rise of Nations Mod
│   ├── ✏️ Blog/                   #
│   └── ⛺ YouthWork/              # Youth work resources
│       └── 🎮 Games/
│
├── 📁 components/
│   ├── 🕹️ controls/
│   ├── 🖼️ display/
│   └── 🧱 layout/
│
├── 📁 constants/
├── 📁 context/
├── 📁 hooks/
├── 📁 styles/
└── 📁 types/

public/
└── 📁 img/                        # Static images
```

## Todo

### Content

- [x] **About** page
- [x] **Recyclotron** project
- [x] **Litter** project

- [ ] **Projects** page
- [ ] **M2TW / RTW** page
- [ ] **RON** page

- [ ] **Youth Work** page

- [ ] **Writing** page
- [ ] **PI** page
- [ ] **Analog** page
- [ ] **Kinsfolk** page

### Projects

- [ ] **Clipboard** project (using Pastebin)?
- [ ] **Cover Letter Generator** project
- [ ] **Munro Bagger** project

### Tech Debt

- [ ] Image storage (Firebase / own api?)
- [ ] Unit tests in **Jest**
- [ ] Integration tests in **Playwright** and **MSW**
