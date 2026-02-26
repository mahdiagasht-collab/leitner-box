
# 🗃️ Leitner Box

An advanced web application for learning with the **Spaced Repetition** method, based on the well‑known **Sebastian Leitner System**.

<br/>

## 📸 Preview

> Dashboard — overview of boxes and cards due for review today  
> Review Page — interactive flashcard with flip animation  
> Card Management — add, edit, filter, and delete cards

<br/>

## ✨ Features

- 📦 **5 Leitner Boxes** with review intervals: daily, 2‑day, 4‑day, weekly, bi‑weekly  
- 🎴 **Interactive flashcards** with 3D flip animation  
- 📊 **Statistics dashboard** — total cards, due cards, mastered cards  
- ➕ **Full card management** — add, edit, delete, filter  
- 💾 **Local storage** — no server or database required  
- ♿ **Accessible** — ARIA, keyboard navigation, focus management  
- 📱 **Responsive** — optimized for mobile, tablet, and desktop  
- 🌙 **Dark mode** with Vazirmatn font for Persian text

<br/>

## 🏗️ Architecture

The project is built with **MVC (Model–View–Controller)** architecture and follows **SOLID** principles and **OOP** design.

```
leitner-box/
├── index.html                  # Entry point — semantic HTML
├── assets/
│   └── css/
│       ├── variables.css       # Design tokens — CSS custom properties
│       ├── reset.css           # Modern CSS reset + base styles
│       ├── animations.css      # Keyframes & motion
│       ├── layout.css          # App shell, grid, views
│       └── components.css      # Buttons, cards, forms, modal, toast
└── src/
    ├── app.js                  # Composition root — main initializer
    ├── models/
    │   ├── Card.js             # Entity — card model
    │   ├── LeitnerConfig.js    # Value object — system configuration
    │   └── CardRepository.js   # Data access — storage management
    ├── views/
    │   ├── BaseView.js         # Abstract base — shared view logic
    │   ├── DashboardView.js    # Dashboard & statistics
    │   ├── ReviewView.js       # Flashcard review session
    │   ├── CardsView.js        # Card list & management
    │   ├── ModalView.js        # Add/edit modal
    │   └── ToastView.js        # Temporary notifications
    └── controllers/
        ├── AppController.js    # Orchestrator — main coordinator
        ├── ReviewController.js # Review session logic
        └── CardController.js   # CRUD operations for cards
```

<br/>

## 🧠 Leitner Algorithm

```
Correct answer ✓  →  Move card to the next box (max: 5)
Wrong answer ✗    →  Send card back to Box 1

Box 1 → review tomorrow          (1 day)
Box 2 → review in 2 days         (2 days)
Box 3 → review in 4 days         (4 days)
Box 4 → review next week         (8 days)
Box 5 → review in 2 weeks        (16 days)
```

<br/>

## 🚀 Run

This project is a **Static Web App** and does not require any build tools or server.

<br/>

## 🛠️ Technologies

| Tool | Purpose |
|------|---------|
| **HTML5** | Semantic structure + ARIA |
| **CSS3** | Custom properties, Grid, Flexbox, animations |
| **JavaScript ES2022** | ES modules, classes, optional chaining, crypto.randomUUID |
| **localStorage** | Browser‑based data persistence |

No **frameworks** or external libraries — pure Vanilla JS.

<br/>

## 📄 License

MIT License — free to use, modify, and distribute.

<br/>

## 🌐 Live Demo

[View Website](https://mahdiagasht-collab.github.io/leitner-box/)

<br/>

---

<div align="center">
  Built with ❤️ and Vanilla JS
</div>