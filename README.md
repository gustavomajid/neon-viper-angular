# Neon Viper

A polished, responsive Snake game built with Angular 22 and TypeScript.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Controls

- Move with the arrow keys or `W`, `A`, `S`, and `D`.
- Pause or resume with `Space` or `P`.
- On touch devices, swipe on the board or use the directional pad.
- Collect cyan signals to grow and increase your score.
- Avoid the walls and your own body.

The game speeds up as your score rises. Your best score is saved in local browser
storage and can be reset from the controls below the board.

## Validation

```bash
npm run format
npm run lint
npm run typecheck
npm test
npm run build
```

The application uses Angular standalone components and Signals. The game engine
and local-storage utilities remain framework-independent TypeScript modules.

Tests run once by default for deterministic CI execution. Use `npm run test:watch`
while developing locally.
