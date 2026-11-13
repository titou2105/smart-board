# Smart Board

@AGENTS.md

## En une phrase
Un tableau de to-do façon Trello, pour un actif débordé (Thomas d'abord) : on dit sa tâche en une phrase,
l'assistant pose les questions qui manquent (titre, description, échéance) et range une carte complète dans le tableau.

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind 4 + shadcn/ui
- Tests : Vitest. Scripts : tsx.
- Données : fichier local `data/tasks.json` (M1-M2), puis Supabase au M3 (accès téléphone) ; démo sur données fictives
- Saisie : commande Claude Code `/tache` (M1), puis assistant dans l'app : Claude Code headless, puis API Claude (`LLM_PROVIDER`)
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
- 2026-11-13 — `docs/product.md` v0.2 validée avec Thomas : capture via Claude Code d'abord (`/tache`), vision long terme
  « branchée sur le quotidien » (mails perso, agenda, partage), accès téléphone → Supabase au M3, bilingue, 4 jalons
  (30 nov., 18 déc., 7 fév., 28 fév.), 8 EPICs + 7 après l'horizon, 26 US. UI reportée à un atelier (US-2.1).
  Prochaine étape : US-1.1 (format des tâches), puis US-1.2 (`/tache`).
  Blocages : aucun. Questions ouvertes : horizon fin février ou plan B, fournisseur mail perso, création du dépôt GitHub.

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
- 2026-11-13 — Saisie d'abord via Claude Code (`/tache`). Pourquoi : coût couvert par l'abonnement, valeur immédiate.
  Assistant dans l'app : Claude Code headless d'abord, API Claude ensuite (version en ligne et téléphone).
- 2026-11-13 — Pas de colonnes figées : une tâche, ce sont des données, les vues sont calculées. Vue liste par échéance
  provisoire ; atelier UI en M2 (aucune maquette ne convainc encore Thomas).
- 2026-11-13 — Modèle de données simple mais extensible : champs optionnels ajoutables sans casser l'existant, `schemaVersion`.
  Statuts : à faire / en cours / fait.
- 2026-11-13 — Accès depuis le téléphone → tâches dans Supabase (gratuit) à partir du M3, connexion par lien magique.
  Fichier local `data/tasks.json` d'ici là. Pourquoi : un fichier du PC n'est pas lisible depuis le téléphone.
- 2026-11-13 — Bilingue EN/FR dès le M1, inscrit dans la DoD.
- 2026-11-13 — Horizon 3 mois, 3 sessions/semaine. Long terme : intégrations (mails perso uniquement, agenda, partage), toujours avec validation.
- 2026-11-13 — `backlog.json` reste la source de vérité ; GitHub Issues générées par script (US-4.4).

## Feuille de route
- Détail : `docs/product.md` et le cockpit (`npm run cockpit`).
- [ ] M1 — Capture via Claude Code (E1) — cible 30 novembre 2026
- [ ] M2 — App utilisable et en ligne (E2, E3) — cible 18 décembre 2026
- [ ] M3 — Partout, avec l'assistant (E4, E5, E6) — cible 7 février 2027
- [ ] M4 — Premières intégrations (E7, E8) — cible 28 février 2027
