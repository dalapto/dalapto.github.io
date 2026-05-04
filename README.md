# dalapto.github.io

This is the repository for my personal portfolio website.

## Here be dragons 🐉

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

- [ ] Flesh out **About** page
- [ ] Flesh out **Recyclotron** project
- [ ] Flesh out **Litter** project
- [ ] Flesh out **M2TW** page
- [ ] Flesh out **RON** page
- [ ] Flesh out **Youth Work** page
- [ ] Flesh out **Blog** page

### Projects

- [ ] Design **Cover Letter Generator** project
- [ ] Design **Clipboard** project

### Tech Debt

- [ ] Implement image storage (Firebase?)
- [ ] Write unit tests in **Jest**
- [ ] Write integration tests in **Playwright**
