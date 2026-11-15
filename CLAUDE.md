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
- 2026-11-14 — US-1.1 faite : format `data/tasks.json` (`src/core/task-file.ts`, 11 tests), script `tasks:check`.
  Premières vraies tâches capturées à la main dans la conversation (prototype de `/tache`) : 3 tâches (2 perso, 1 pro).
  Appris pour `/tache` : Thomas donne ses tâches en vrac et par catégorie ; regrouper les questions par tâche marche
  bien ; repérer les dépendances (ETA ↔ passeport) apporte de la valeur.
  Prochaine étape : US-1.2 (commande `/tache`), puis US-1.4 (i18n) et US-1.5 (vue liste).
  Blocages : aucun.
- 2026-11-15 — US-1.2 en cours : skill `/tache` rédigé, `addTasks` dans `src/core/` (15 tests) et script `tasks:add`
  (testé sur un fichier temporaire). 4 tâches réelles dans `data/tasks.json`.
  Prochaine étape : Thomas teste `/tache` dans une nouvelle session (test d'acceptation), puis US-1.2 → fait ;
  ensuite US-1.4 (i18n) et US-1.5 (vue liste).
  Blocages : aucun.
- 2026-11-15 — US-1.4 faite sur la branche `us-1.4-interface-bilingue` : next-intl, routes `[locale]` invisibles,
  proxy de détection de langue, dictionnaires `messages/en.json` / `fr.json` (test des clés), page d'accueil Smart Board
  bilingue. Vérifié : FR → français, EN et autres → anglais, URL `/` inchangée, build statique `/en` et `/fr`.
  Corrigé au passage : police Geist (auto-référence `--font-sans` laissée par shadcn) et paquet `@tailwindcss/turbopack`
  mal installé (réinstallé).
  Prochaine étape : fusionner la branche dans `main` (pas de dépôt distant, donc pas de PR) ; test de `/tache` par Thomas
  (US-1.2) ; puis US-1.5 (vue liste par échéance).
  Blocages : pas de dépôt GitHub, donc le cycle branche + PR du harnais ne peut pas aller jusqu'à la PR.
- 2026-11-15 — US-1.5 faite sur la branche `us-1.5-vue-par-echeance` : regroupement En retard / Aujourd'hui /
  Dans les 7 jours / Plus tard (`src/core/due-groups.ts`, heure de Paris), `TaskRepository` fichier/mock
  (`DATA_PROVIDER`), écran liste bilingue, tâches faites repliées, message clair si le fichier est invalide.
  Vérifié en vrai : 4 vraies tâches, mode mock, FR/EN, mobile, fichier invalide ; 26 tests, build OK.
  M1 : il ne reste que la validation de `/tache` par Thomas (US-1.2).
  Prochaine étape : fusionner la branche ; Thomas crée son `.env.local` (`DATA_PROVIDER=file`) et teste `/tache` ;
  puis M2 (atelier UI US-2.1, création du dépôt GitHub).
  Blocages : `.env.local` protégé par le harnais (Thomas le crée lui-même).

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
- 2026-11-13 — Passage au format cockpit commun du harnais (skill `/cockpit`) : `product.md` ne garde que la vision,
  les questions tranchées et ouvertes deviennent des décisions dans `backlog.json`, le cockpit est un fichier HTML
  autonome. Ancien serveur `scripts/cockpit.ts` et dépendance `marked` supprimés. Pourquoi : un seul format pour
  tous les projets, rien écrit deux fois (le JSON avait déjà divergé de la vision).

- 2026-11-14 — Champ optionnel `category` (texte libre, ex. « perso », « pro ») ajouté au modèle. Pourquoi : Thomas
  classe spontanément ses tâches ainsi ; optionnel, il ne casse rien.
- 2026-11-14 — Fichier de tâches : `{ schemaVersion: 1, tasks: [...] }` ; les champs inconnus sont conservés à la
  validation. Pourquoi : ajouter des champs plus tard sans migration.

- 2026-11-15 — `/tache` : Claude fait la conversation, le code fait le mécanique (`addTasks` génère id, statut,
  dates et valide ; rien n'est ajouté si une tâche est incomplète). Pourquoi : pas d'écriture JSON à la main, fiable.
- 2026-11-15 — Deux listes de tâches assumées pour l'instant : `/tache` ne vaut que dans smart-board, le carnet du
  portefeuille garde ses tâches transverses (D18). À revoir quand Smart Board aura fait ses preuves.

- 2026-11-15 — i18n : next-intl, routes `[locale]` invisibles (`localePrefix: "never"`), langue du navigateur via
  `src/proxy.ts`, anglais par défaut (D19). Pourquoi : adresses inchangées et pages statiques, compatibles Cache Components.

- 2026-11-15 — « Cette semaine » = les 7 prochains jours (D20) ; tâches lues via `TaskRepository`, `DATA_PROVIDER`
  mock par défaut (D21). La liste est rendue à chaque requête (`connection()` + `Suspense`, Cache Components).

## Feuille de route
- Détail : `docs/product.md` et le cockpit (`docs/cockpit/index.html`).
- [ ] M1 — Capture via Claude Code (E1) — cible 30 novembre 2026
- [ ] M2 — App utilisable et en ligne (E2, E3) — cible 18 décembre 2026
- [ ] M3 — Partout, avec l'assistant (E4, E5, E6) — cible 7 février 2027
- [ ] M4 — Premières intégrations (E7, E8) — cible 28 février 2027
