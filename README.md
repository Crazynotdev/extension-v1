
## Notes de cette version

- Tests du moteur de dames : `npm test` (Vitest, 13 tests). Correction : un pion qui traverse la dernière rangée en pleine rafle ne promeut plus.
- `docs/splash-screen/` : composant de splash animé prêt à intégrer (voir son `INTEGRATION.md`). Écrit pour Vite : sous Next.js, ajouter `'use client'` et importer le GIF via `.src`. Exclu du typecheck tant que le GIF n'est pas ajouté.
- Règles de dames encore simplifiées : pas de prise maximale, pas de détection d'égalité.
