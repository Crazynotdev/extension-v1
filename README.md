# extension-v1

Livrables COME-AND-FIGHT (CRAZY TECH), à copier dans le projet `come_and_fight` :

- `splash-screen/` : composant SplashScreen animé (voir `INTEGRATION.md`). Écrit pour Vite ; sous Next.js, ajouter `'use client'` et importer le GIF via `.src`. Le GIF est à placer dans `src/assets/splash/splash.gif`.
- `lib/games/dames/engine.ts` : moteur de dames 10x10, avec correction de la promotion en cours de rafle (règle internationale).
- `lib/games/dames/engine.test.ts` : 13 tests Vitest (`npm i -D vitest`, script `"test": "vitest run"`).
