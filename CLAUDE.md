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
- Tout vérifier : `npm run check` (types + lint + tests ; lancé aussi par la CI GitHub à chaque push)
- Lancer en local : `npm run dev` (http://localhost:3000)
- Cockpit produit : skill `/cockpit` du harnais. Régénérer : `node ~/projets/harnais/global/skills/cockpit/build.mjs`,
  puis ouvrir `docs/cockpit/index.html` (double-clic).
- Tests : `npm test` · Types : `npm run typecheck` · Linter : `npm run lint` · Build : `npm run build`
- Ajouter un composant shadcn : `npx shadcn@latest add <composant>`
- Vérifier le fichier de tâches : `npm run tasks:check` (à lancer après chaque écriture dans `data/tasks.json`)
- Ajouter des tâches : skill `/tache` (`.claude/skills/tache/`), qui appelle `npm run --silent tasks:add` (JSON sur l'entrée standard)

## Structure
- `src/core/` — logique métier **pure** (aucun import React/Next) : type `Task`, champs obligatoires,
  `findMissingFields`, interface `TaskAssistant`. Réutilisable telle quelle par la future app mobile.
- `src/lib/tasks/` — implémentations de `TaskRepository` (`file`, `mock`) ; `getTaskRepository()` choisit selon
  `DATA_PROVIDER`. `src/components/task-list.tsx` — vue par échéance (provisoire).
- `src/lib/assistant/` — implémentations de l'assistant (`mock`, plus tard `claude`) ; `getTaskAssistant()`
  choisit selon `LLM_PROVIDER`. Côté serveur uniquement.
- `src/mocks/` — données fictives réalistes (`tasks.ts` : tableau d'exemple).
- `src/app/[locale]/` — pages et routes (la langue n'apparaît pas dans l'URL) ; `src/components/ui/` — composants shadcn.
- `src/i18n/` + `src/proxy.ts` — langues (en, fr), détection de la langue du navigateur ; `messages/` — textes de
  l'interface. **Aucun texte en dur dans les écrans** : tout passe par `messages/en.json` et `messages/fr.json`.
- `docs/product.md` — la vision (texte). `docs/cockpit/backlog.json` — jalons, EPIC, US, décisions, risques
  (source de vérité). `docs/cockpit/index.html` — cockpit généré, ne pas modifier à la main.

## Variables d'environnement
Voir `.env.example`. Copier en `.env.local`. Ne jamais commiter `.env.local`.
`DATA_PROVIDER=mock|file` : `mock` (défaut) affiche les tâches fictives, `file` les vraies tâches de `data/tasks.json`.
`ANTHROPIC_API_KEY` reste côté serveur : jamais de préfixe `NEXT_PUBLIC_`.

## Conventions du projet
- Toute source externe (LLM, stockage) passe par une interface dans `src/core/`, avec une implémentation mock.
- Code et README en anglais ; commentaires, commits et interface en français (langue de l'UI : question ouverte).
- Quand une US change de statut, mettre à jour `docs/cockpit/backlog.json` puis régénérer le cockpit.
- **Fichier de verrouillage** : sous Windows, `npm install` retire de `package-lock.json` des paquets propres à Linux
  (`@emnapi/*`), et la CI (`npm ci` sous Linux) échoue. `npm run check` le détecte (`lock:check`). Pour ajouter un
  paquet : repartir du `package-lock.json` de `main` et n'y ajouter que l'entrée du nouveau paquet (cf. US-2.4),
  puis vérifier avec `npm run lock:check`.

## Où on en est
<!-- Remplacé (pas complété) en fin de session, 5 lignes maximum : date — état actuel — prochaine étape — blocages -->
2026-11-23 — M1 bouclé (5/5 US). M2 en cours : E2 bouclé ; US-3.1 livrée (PR #12), démo : https://smart-board-puce.vercel.app
D15 (horizon fin février) et D16 (mails Yahoo + Gmail) tranchées ; US-8.1 à découper (Gmail / Yahoo).
Prochaine étape : US-3.2 (données de démo par navigateur), puis US-3.3 (README). Cible M2 : 18 décembre.
Blocages : aucun (`.env.local` recréé dans le projet).

## Décisions
Dans `docs/decisions.md` (lu à la demande). Les décisions produit vont dans le backlog.

## Feuille de route
- Détail : `docs/product.md` et le cockpit (`docs/cockpit/index.html`).
- [ ] M1 — Capture via Claude Code (E1) — cible 30 novembre 2026
- [ ] M2 — App utilisable et en ligne (E2, E3) — cible 18 décembre 2026
- [ ] M3 — Partout, avec l'assistant (E4, E5, E6) — cible 7 février 2027
- [ ] M4 — Premières intégrations (E7, E8) — cible 28 février 2027
