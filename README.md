## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## demo

https://manis-real.vercel.app

Examples:
![Desktop](./demo-desktop.png)
![Mobile](./demo-mobile.png)

## approach

Initially i create a plan using chatgpt web and save it as [PLAN.md](./PLAN.md). Then compress the plan using DeepSeek + Pi save it as [glossary.mid](./docs/glossary.md). After some review I ask it to create ADR documents. Then start the implementation.

At phase 1, all assets and scene / layout is rendered as 2D.
Currently implementing 3D scene and assets. It's half baked done for layout, monitor, chair and desk assets. But the assets looks boxy and unrealistic. Current todo:

- [ ] replace 3D asset with more relatistic.
- [ ] add drag n drop product selector
  - [ ] at right side
  - [ ] on left side
- [ ] use jotai state management
- [ ] support IDR currency
- [ ] l10n
- [ ] dark mode
