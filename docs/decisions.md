# Décisions techniques — Smart Board

> Date — décision — pourquoi. Lu à la demande : contrairement au `CLAUDE.md`, ce fichier n'est pas relu à chaque message.

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
- 2026-11-16 — UI : direction A de l'atelier (liste par échéance en lignes, bilan de la semaine, filtre perso/pro,
  « En cours » plein, saisie à portée de pouce). Pas de vue secondaire pour l'instant. Accent indigo. Détails dans
  `docs/design.md` (D14). Pourquoi : correspond à l'usage réel (ajout sur téléphone, suivi de la semaine).
- 2026-11-19 — Démo hébergée sur Vercel (offre Hobby, gratuite), projet `smart-board` relié au dépôt GitHub :
  chaque push sur `main` redéploie la production, chaque branche a son aperçu. Aucune variable d'environnement
  (mock par défaut). L'app GitHub Vercel n'a accès qu'à ce dépôt. URL : https://smart-board-puce.vercel.app
