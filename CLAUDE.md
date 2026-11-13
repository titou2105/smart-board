# Smart Board

@AGENTS.md

## En une phrase
Un tableau de to-do façon Trello, pour un actif débordé (Thomas d'abord) : on dit sa tâche en une phrase,
l'assistant pose les questions qui manquent (titre, description, échéance) et range une carte complète dans le tableau.

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind 4 + shadcn/ui
- Tests : Vitest. Scripts : tsx.
- Données : localStorage d'abord (US-1.4), Supabase plus tard (E9)
- Assistant : mock d'abord, API Claude au jalon M4 (`LLM_PROVIDER=mock|claude`)
- Mobile plus tard : Expo, en réutilisant `src/core/`

## Commandes
- Lancer en local : `npm run dev` (http://localhost:3000)
- Cockpit produit : `npm run cockpit` (http://localhost:4321, vision en HTML sur `/vision`)
- Tests : `npm test` · Types : `npm run typecheck` · Linter : `npm run lint` · Build : `npm run build`
- Ajouter un composant shadcn : `npx shadcn@latest add <composant>`

## Structure
- `src/core/` — logique métier **pure** (aucun import React/Next) : type `Task`, champs obligatoires,
  `findMissingFields`, interface `TaskAssistant`. Réutilisable telle quelle par la future app mobile.
- `src/lib/assistant/` — implémentations de l'assistant (`mock`, plus tard `claude`) ; `getTaskAssistant()`
  choisit selon `LLM_PROVIDER`. Côté serveur uniquement.
- `src/mocks/` — données fictives réalistes (`tasks.ts` : tableau d'exemple).
- `src/app/` — pages et routes ; `src/components/ui/` — composants shadcn.
- `docs/product.md` — vision, jalons, EPICs et US. `docs/cockpit/` — `backlog.json` (statuts) + `index.html`.
- `scripts/cockpit.ts` — serveur local du cockpit.

## Variables d'environnement
Voir `.env.example`. Copier en `.env.local`. Ne jamais commiter `.env.local`.
`ANTHROPIC_API_KEY` reste côté serveur : jamais de préfixe `NEXT_PUBLIC_`.

## Conventions du projet
- Toute source externe (LLM, stockage) passe par une interface dans `src/core/`, avec une implémentation mock.
- Code et README en anglais ; commentaires, commits et interface en français (langue de l'UI : question ouverte).
- Quand une US change de statut, mettre à jour `docs/cockpit/backlog.json`.

## Où on en est
<!-- Mis à jour en fin de session : date — état actuel — prochaine étape — blocages -->
- 2026-11-13 — Projet créé (Next.js 16.4, shadcn, Vitest). Socle `src/core/` (Task, champs obligatoires,
  interface assistant) + assistant mock, 6 tests verts. Vision v0.1 dans `docs/product.md` (4 jalons, 11 EPICs,
  17 US) et cockpit (`npm run cockpit`).
  Prochaine étape : Thomas relit `docs/product.md` (hypothèses ⚠️ + 5 questions ouvertes), puis US-1.1 (tableau).
  Blocages : aucun. Dépôt GitHub pas encore créé (en attente de l'accord de Thomas).

## Décisions
<!-- Claude ajoute ici les choix importants : date — décision — pourquoi -->
- 2026-11-13 — Nom : `smart-board`.
- 2026-11-13 — Web d'abord (Next.js), mobile ensuite. Logique métier isolée dans `src/core/` sans dépendance
  à React/Next. Pourquoi : la réutiliser telle quelle dans une app Expo.
- 2026-11-13 — Champs obligatoires d'une carte : titre, description, échéance (date `AAAA-MM-JJ`).
  Pourquoi : le minimum pour qu'une tâche soit actionnable.
- 2026-11-13 — Assistant derrière l'interface `TaskAssistant`, asynchrone même en mock ; `LLM_PROVIDER=claude`
  lève une erreur claire tant qu'il n'est pas implémenté. Pourquoi : gratuit d'abord, pas d'échec silencieux.
- 2026-11-13 — Même démarche produit que City Roulette : `docs/product.md` + `backlog.json` + cockpit HTML ;
  le cockpit affiche aussi la vision en HTML (`/vision`). Pourquoi : cohérence entre projets, rien à payer.
- 2026-11-13 — `@types/node` en v24 (et non 20 comme le modèle Next). Pourquoi : Vitest 5 l'exige, et Node 24 est installé.
- 2026-11-13 — Branche principale renommée `main`.

## Feuille de route
- Détail : `docs/product.md` et le cockpit.
- [ ] M1 — Tableau utilisable (E1)
- [ ] M2 — Assistant de saisie en mock (E2)
- [ ] M3 — Démo en ligne sur Vercel + README (E3, E4) — cible ⚠️ 15 janvier 2027
- [ ] M4 — Vrai assistant avec Claude (E5)
