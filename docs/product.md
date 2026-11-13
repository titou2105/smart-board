# Smart Board — Vision produit et backlog

> v0.1 — 2026-11-13. **Brouillon à relire par Thomas.** Les points marqués ⚠️ sont des hypothèses à confirmer.
> Le backlog est recopié dans `docs/cockpit/backlog.json` (source de vérité des statuts), affiché par le cockpit (`npm run cockpit`).
> Après la relecture, on met à jour ce document et le JSON ensemble.

---

## 1. Vision long terme

### Le problème
On note ses tâches à la va-vite : « appeler le plombier », « passeport ». Pas de date, pas de contexte.
Trois semaines plus tard, la carte est toujours là, floue, et on ne sait plus ni pourquoi ni pour quand.
Les outils de type Trello sont puissants, mais **remplir une carte proprement demande un effort** qu'on ne fait pas.

### Pour qui
- **Cœur de cible** : Thomas d'abord. Un actif qui jongle entre travail, projets perso et administratif,
  et qui capture ses tâches entre deux réunions.
- **Ensuite** ⚠️ : les professionnels pressés qui veulent un tableau simple, sans paramétrage.
- **Moment d'usage** : quand une tâche surgit (dans le métro, en réunion), puis le matin pour faire le point.

### La promesse
**« Dis-le, c'est rangé. »** Tu écris (ou dictes) ta tâche comme elle te vient. L'assistant comprend ce qu'il
peut, **te pose les questions qui manquent**, une à la fois, et la carte arrive complète dans ton tableau.

### Ce que l'app peut devenir (horizon 6 mois, jusqu'à mai 2027) ⚠️
- **Tableau Kanban** simple : À faire / En cours / Fait.
- **Assistant de saisie** : une phrase → une carte complète (titre, description, échéance), avec questions de relance.
- **Champs enrichis** : priorité, projet, sous-tâches, estimation de durée (proposés par l'assistant).
- **Dictée vocale** : parler au lieu de taper.
- **« Ma journée »** : chaque matin, l'assistant propose 3 tâches à attaquer selon les échéances.
- **Rappels** : notification avant l'échéance.
- **App mobile** (Expo), qui réutilise la logique métier du web (`src/core/`).
- **Compte optionnel** (Supabase) pour retrouver son tableau sur plusieurs appareils.

### Ce qu'on ne fera pas
- ❌ Collaboration en équipe (tableaux partagés, temps réel) : c'est un outil **personnel**.
- ❌ Paramétrage avancé (colonnes à l'infini, automatisations façon Trello Power-Ups).
- ❌ Fonctions payantes, tant que c'est un side project.

### Principes produit
1. **Pas de carte incomplète** : titre, description et échéance sont obligatoires. L'assistant insiste, poliment.
2. **L'assistant demande, il ne devine pas en silence** : s'il déduit une info (ex. « vendredi » → une date), il la montre avant de créer la carte.
3. **Une question à la fois** : jamais un formulaire déguisé.
4. **Gratuit d'abord** : tout marche en mode mock, sans clé ni carte bancaire.
5. **Web d'abord, mobile ensuite** : la logique métier ne dépend ni de React ni de Next.js.

---

## 2. Vision court terme

### Objectif
Un outil que **Thomas utilise vraiment au quotidien**, et une **vitrine portfolio** : une démo en ligne,
un README en anglais, une démarche produit visible (ce document + le cockpit).

### Critères de succès
- [ ] Thomas crée ses vraies tâches dans Smart Board pendant 2 semaines d'affilée.
- [ ] Une carte complète se crée en **moins de 30 secondes** via l'assistant.
- [ ] Une **URL publique** permet de tester l'app sans compte ni installation.
- [ ] Le **README** contient : pitch, captures ou GIF, stack, lancement en local, lien vers ce document.

### Dans le périmètre / hors périmètre
| Dans le périmètre (MVP) | Hors périmètre (plus tard) |
|---|---|
| Tableau 3 colonnes, glisser-déposer | Colonnes personnalisables |
| Titre + description + échéance obligatoires | Priorité, projet, sous-tâches, durée |
| Assistant de saisie (mock, puis Claude) | Dictée vocale, « Ma journée » |
| Sauvegarde dans le navigateur | Compte et synchronisation (Supabase) |
| Démo web sur Vercel | App mobile Expo, rappels |

### Choix de séquencement
1. **M1 — d'abord un tableau qui marche à la main.** Sans lui, l'assistant n'a nulle part où ranger les cartes.
2. **M2 — ensuite l'assistant, en mock.** On construit toute l'expérience de conversation gratuitement.
3. **M3 — mise en ligne** de la démo (en mock), avec le README.
4. **M4 — brancher Claude** pour une vraie compréhension du langage. C'est la seule étape potentiellement payante.

### Plan par jalons
Estimation en sessions de travail (S = 1 session, M = 2, L = 3+).

| Jalon | Objectif | EPICs | Estimation ⚠️ | Date cible ⚠️ |
|---|---|---|---|---|
| **M1 — Tableau utilisable** | Créer, déplacer, modifier ses cartes ; tout est sauvegardé | E1 | ~8 sessions | — |
| **M2 — Assistant de saisie** | Une phrase → une carte complète, en mode mock | E2 | ~7 sessions | — |
| **M3 — Démo en ligne** | URL publique + README portfolio | E3, E4 | ~4 sessions | **15 janvier 2027** |
| **M4 — Vrai assistant** | Claude comprend le langage naturel | E5 | ~6 sessions | — |

### Definition of Done (DoD)
Une US est « faite » quand :
- [ ] Tous ses critères d'acceptation sont remplis.
- [ ] La logique métier est dans `src/core/` (sans React), pour être réutilisable sur mobile.
- [ ] Les types (`npm run typecheck`), le linter (`npm run lint`) et les tests (`npm test`) passent.
- [ ] Ça a été vérifié dans le navigateur, sur ordinateur et en largeur mobile.
- [ ] Le statut est mis à jour dans `docs/cockpit/backlog.json`.

---

## 3. Backlog

Format des US : *En tant que … je veux … afin de …*, puis les critères d'acceptation (CA), la taille et le statut.
Statuts possibles : `à faire`, `en cours`, `fait`.

### Jalon M1 — Tableau utilisable

#### E1 — Tableau Kanban
Voir, créer, déplacer et modifier ses cartes à la main.

- **US-1.1 — Voir mon tableau** · M · à faire
  En tant qu'utilisateur, je veux voir mes tâches dans trois colonnes (À faire, En cours, Fait), afin de
  savoir d'un coup d'œil où j'en suis.
  - CA : chaque carte affiche son titre et son échéance.
  - CA : au premier lancement, le tableau contient les tâches d'exemple (`src/mocks/tasks.ts`).
  - CA : sur mobile, les colonnes s'empilent ou défilent horizontalement, sans casser la page.
- **US-1.2 — Déplacer une carte** · M · à faire
  En tant qu'utilisateur, je veux faire glisser une carte d'une colonne à l'autre, afin de suivre l'avancement.
  - CA : glisser-déposer à la souris et au doigt.
  - CA : une alternative sans glisser existe (menu « Déplacer vers… »), pour l'accessibilité.
- **US-1.3 — Créer et modifier une carte** · S · à faire
  En tant qu'utilisateur, je veux ouvrir une carte et changer son titre, sa description ou son échéance,
  afin de corriger ou préciser une tâche.
  - CA : l'enregistrement est refusé tant qu'un champ obligatoire est vide, avec un message clair.
  - CA : la même fenêtre sert à créer une carte à la main (sans l'assistant).
- **US-1.4 — Retrouver mon tableau** · S · à faire
  En tant qu'utilisateur, je veux retrouver mes cartes quand je rouvre l'app, afin de ne rien perdre.
  - CA : les cartes sont sauvegardées dans le navigateur (localStorage).
  - CA : le stockage passe par une interface `TaskRepository`, pour brancher Supabase plus tard sans toucher aux écrans.
- **US-1.5 — Supprimer une carte** · S · à faire
  En tant qu'utilisateur, je veux supprimer une carte devenue inutile, afin de garder un tableau propre.
  - CA : une confirmation est demandée avant la suppression.
- **US-1.6 — Repérer les urgences** · S · à faire
  En tant qu'utilisateur, je veux voir quelles cartes sont en retard ou dues aujourd'hui, afin de savoir quoi faire en priorité.
  - CA : un badge « En retard » ou « Aujourd'hui » s'affiche sur les cartes non terminées concernées.
  - CA : dans chaque colonne, les cartes sont triées par échéance.

### Jalon M2 — Assistant de saisie

#### E2 — Créer une carte en parlant à l'assistant
Le cœur de la promesse : une phrase, quelques questions, une carte complète.

- **US-2.1 — Dire ma tâche en une phrase** · M · à faire
  En tant qu'utilisateur, je veux écrire ma tâche comme elle me vient (« appeler le plombier avant vendredi »),
  afin de ne pas remplir de formulaire.
  - CA : un champ de saisie unique, accessible depuis le tableau.
  - CA : l'assistant remplit le brouillon avec ce qu'il a compris.
- **US-2.2 — Répondre aux questions de l'assistant** · M · à faire
  En tant qu'utilisateur, je veux que l'assistant me demande ce qui manque, une question à la fois, afin
  que chaque carte soit complète.
  - CA : l'assistant pose une question par champ manquant (titre, description, échéance).
  - CA : une réponse invalide (ex. une date incompréhensible) entraîne une nouvelle question.
  - CA : je peux abandonner à tout moment, sans créer de carte.
- **US-2.3 — Valider la carte avant création** · S · à faire
  En tant qu'utilisateur, je veux voir un aperçu de la carte et pouvoir la corriger, afin que l'assistant
  ne crée rien que je n'ai pas validé.
  - CA : un aperçu montre les trois champs ; « Créer » ajoute la carte dans « À faire ».
- **US-2.4 — Comprendre les dates en français** · M · à faire
  En tant qu'utilisateur, je veux écrire « demain », « vendredi » ou « dans 2 semaines », afin de ne pas
  taper de date au format AAAA-MM-JJ.
  - CA : les expressions courantes sont converties en date, en code (sans IA), et affichées pour validation.
  - CA : au moins 15 expressions couvertes par des tests.

### Jalon M3 — Démo en ligne

#### E3 — Déploiement web
- **US-3.1 — Démo publique** · S · à faire
  En tant que recruteur, je veux ouvrir la démo depuis un lien, afin de tester l'app sans rien installer.
  - CA : l'app est en ligne sur Vercel (offre gratuite), en mode mock.
  - CA : chaque push sur `main` met à jour la démo automatiquement.
- **US-3.2 — Données de démo** · S · à faire
  En tant que visiteur, je veux un tableau d'exemple et un bouton « Réinitialiser », afin de tester sans
  craindre de tout casser.
  - CA : chaque visiteur a son propre tableau (dans son navigateur).

#### E4 — Vitrine portfolio
- **US-4.1 — README portfolio** · M · à faire
  En tant que recruteur, je veux comprendre le projet en 1 minute depuis GitHub, afin d'évaluer le travail de Thomas.
  - CA : README en anglais avec pitch, lien de démo, captures ou GIF, stack, lancement en local.
  - CA : un lien vers la vision produit et le cockpit.
- **US-4.2 — Cockpit public** · S · à faire
  En tant que recruteur, je veux voir la vision et le backlog du projet, afin de constater la démarche produit.
  - CA : le cockpit est accessible en ligne depuis le README.

### Jalon M4 — Vrai assistant

#### E5 — Brancher Claude
- **US-5.1 — Comprendre le langage naturel** · L · à faire
  En tant qu'utilisateur, je veux que l'assistant comprenne vraiment ma phrase (titre, contexte, date),
  afin de répondre à moins de questions.
  - CA : `LLM_PROVIDER=claude` utilise l'API Claude côté serveur ; la clé n'est jamais envoyée au navigateur.
  - CA : la réponse de Claude respecte le contrat `AssistantTurn` (sortie structurée).
  - ⚠️ L'API Claude est payante à l'usage (de l'ordre de quelques centimes par mois pour un usage perso avec un petit modèle).
- **US-5.2 — Maîtriser les coûts** · S · à faire
  En tant que porteur du projet, je veux limiter le nombre d'appels, afin de ne jamais avoir de mauvaise surprise sur la facture.
  - CA : un plafond d'appels par jour, et la démo publique reste en mock ⚠️.
- **US-5.3 — Évaluer l'assistant** · M · à faire
  En tant que porteur du projet, je veux un jeu de 20 phrases avec le résultat attendu, afin de mesurer
  la qualité de l'assistant à chaque changement de prompt.
  - CA : un script affiche le taux de champs correctement extraits.

### Après le MVP (EPICs seulement, pas encore découpés)
- **E6 — Champs enrichis** : priorité, projet, sous-tâches, estimation de durée, proposés par l'assistant.
- **E7 — Dictée vocale** : parler au lieu de taper.
- **E8 — « Ma journée »** : l'assistant propose chaque matin 3 tâches à attaquer.
- **E9 — Compte et synchronisation** : compte optionnel (Supabase) pour retrouver son tableau partout.
- **E10 — App mobile** : Expo, en réutilisant `src/core/`.
- **E11 — Rappels** : notification avant l'échéance (nécessite l'app mobile ou les notifications web).

---

## 4. Questions tranchées (2026-11-13)
1. **Support** : web d'abord (Next.js), mobile ensuite, logique métier partagée dans `src/core/`.
2. **Champs obligatoires** : titre, description, échéance.
3. **Nom** : `smart-board`.

## 5. Questions ouvertes (à trancher à la relecture)
1. **Langue de l'interface** : français seulement, ou bilingue EN/FR dès le départ (meilleur pour le portfolio, mais un peu plus de travail) ?
2. **Date cible de la démo** : le 15 janvier 2027 te va-t-il ?
3. **Cerveau de l'assistant (M4)** : API Claude (payante mais déployable en ligne) ou Claude Code en local
   comme PreDriver Coach (gratuit, mais pas utilisable sur la démo en ligne) ?
4. **Colonnes** : on garde 3 colonnes fixes pour le MVP ?
5. **Tickets** : on reste sur `backlog.json` + cockpit comme City Roulette, ou on passe à GitHub Issues comme PreDriver Coach ?
