# 🃏 **Preflop Range Trainer**

> 🎯 _Train your poker instincts. Define your ranges, make decisions, and master preflop strategy — all in your browser._

A modern **React + TypeScript** web app designed to help players **practice preflop decisions** and **refine their ranges** through an elegant, local-first interface.

💡 _Original UI/UX design fully crafted by [@n1kFord](https://github.com/n1kFord) with a focus on simplicity, speed, and clarity._

---

## ✨ **Overview**

**Preflop Range Trainer** allows you to create and train **preflop ranges** for any position at the poker table.

It supports intuitive range input using **standard shorthand notations** like `A2s+`, `K7`, or `QJo`, making setup seamless for experienced players.

After defining your ranges, jump into **Practice Mode**, where you’re dealt random hands in random positions.
Your task: choose the correct preflop action based on your defined ranges — and see instantly whether you deviated or nailed it.

> ⚙️ **Everything runs locally.**
> Your ranges are stored in the browser — portable, fast, and private.

---

## 🚀 **Features**

- ♠️ **Interactive range input** with full `prange` notation support
- 🪶 **Local-first architecture** — zero backend dependencies
- 🎮 **Practice mode** with random hands and positional logic
- 🧠 **Real-time feedback** on your decisions
- 💅 **Custom SCSS design** built from scratch
- ⚛️ **React 19 + TypeScript** foundation
- 🧰 **Code quality tooling** — ESLint, Stylelint, Prettier
- 🧩 **Modular architecture** with reusable components and hooks

---

## 🧭 **Roadmap**

Currently supports **RFI (Raise First In)** training.
Planned expansions include:

- 🧱 **Reaction scenarios** — vs 3-bets, opens, and limps
- 🎯 **Isolate / Call / Fold logic**
- 🔄 **Range import/export and sharing tools**
- 💾 **Optional cloud sync** (future enhancement)

---

## 🌐 **Live Demo**

Experience it online:  
👉 **[preflop-range-trainer.vercel.app](https://preflop-range-trainer.vercel.app/)** _(coming soon)_

> Deployed with ❤️ on [Vercel](https://vercel.com) — optimized for Chrome & Firefox.

---

## 🏁 **Getting Started Locally**

Clone the repo and install dependencies:

```bash
git clone https://github.com/n1kFord/preflop-range-trainer.git
cd preflop-range-trainer
npm install
npm start
```

> 🧩 No backend setup required — runs entirely in your browser.

---

## 🗂️ **Project Structure**

```
preflop-range-trainer/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Icons, images, etc.
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── styles/              # SCSS modules and global styles
│   ├── utils/               # Helper functions
│   ├── index.tsx            # Entry point
└── ...
```

---

## 📸 **Preview**

<p align="center">
  <img src="https://i.ibb.co.com/0V25ChCp/2025-10-26-11-15-27.png" alt="Preview 1" />
  <br />
  <img src="https://i.ibb.co.com/YFF9ryz0/2025-10-26-11-16-21.png" alt="Preview 2" />
</p>

---

## 📄 **License**

This project is licensed under the [MIT License](./LICENSE).
Feel free to use, modify, and distribute with attribution.

> 💡 Created with care and design by [@n1kFord](https://github.com/n1kFord)
