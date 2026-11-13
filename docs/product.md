# Smart Board — Vision produit et backlog

> v0.2 — 2026-11-13. Relue par Thomas (v0.1 du même jour). Les points marqués ⚠️ restent des hypothèses à confirmer en route.
> Le backlog est recopié dans `docs/cockpit/backlog.json` (source de vérité des statuts), affiché par le cockpit (`npm run cockpit`).

---

## 1. Vision long terme

### Le problème
On note ses tâches à la va-vite : « appeler le plombier », « passeport ». Pas de date, pas de contexte.
Trois semaines plus tard, la tâche est toujours là, floue, et on ne sait plus ni pourquoi ni pour quand.
Et beaucoup de tâches ne sont jamais notées : elles dorment dans un mail ou un message.

### Pour qui
- **Cœur de cible** : Thomas d'abord. Un actif qui jongle entre travail, projets perso et administratif.
- **Ensuite** ⚠️ : les professionnels pressés qui veulent un outil simple, sans paramétrage.
- **Moment d'usage** : quand une tâche surgit, puis le matin pour faire le point.

### La promesse
**« Dis-le, c'est rangé. »** Tu dis ta tâche comme elle te vient. L'assistant comprend ce qu'il peut,
**te pose les questions qui manquent**, une à la fois, et la tâche arrive complète dans ta liste.

### Ce que l'app peut devenir (horizon 3 mois, mi-février 2027)
**L'ambition** : passer d'une to-do qu'on remplit à la main à un **outil branché sur le quotidien**. Les tâches
arrivent d'elles-mêmes depuis les endroits où elles naissent (mails, agenda, messages), et l'assistant les
propose sous forme de tâches complètes. **Rien n'est créé sans ta validation**, et l'ajout manuel reste toujours possible.

**Étape 1 — Saisie assistée (M1 à M3)**
- **Capture via Claude Code** : tu dictes ta tâche dans Claude Code (commande `/tache`), qui te relance et l'enregistre.
  Coût couvert par l'abonnement Claude existant.
- **L'app** affiche et organise les tâches ; on peut aussi y ajouter ou modifier une tâche à la main.
- **L'assistant dans l'app** : d'abord via Claude Code en local (gratuit), puis via l'API Claude (payant, mais utilisable en ligne).

**Étape 2 — Tâches captées automatiquement (M4 et au-delà)** ⚠️
- 📥 **Boîte de réception** : les tâches proposées attendent ta validation avant d'entrer dans ta liste.
- 📧 **Mails perso** : l'assistant repère les mails qui demandent une action et propose une tâche.
- 📅 **Agenda** : les échéances apparaissent dans le calendrier ; une réunion peut générer ses tâches de suivi.
- 💬 **Messages et réseaux** : la plupart (WhatsApp perso, Instagram, LinkedIn) n'ouvrent pas leurs messages
  aux applis tierces. Piste réaliste : un **partage** vers Smart Board depuis le téléphone.
- 📄 **Documents** : une facture transférée devient une tâche « payer avant le… ».
- **Vie privée** : accès en lecture seule, le minimum de données conservées, chaque connexion se coupe en un clic.

**Partout** : les tâches vivent dans le cloud (Supabase), pour en ajouter depuis le téléphone comme depuis l'ordinateur.

**Plus tard** : champs enrichis (priorité, projet, sous-tâches), dictée vocale, « Ma journée », rappels,
app mobile native (Expo).

### Ce qu'on ne fera pas
- ❌ Collaboration en équipe (listes partagées, temps réel) : c'est un outil **personnel**.
- ❌ Paramétrage avancé (automatisations façon Trello Power-Ups).
- ❌ Boîte mail pro : on se limite aux mails perso (la DSI bloque en général les applis tierces).
- ❌ Fonctions payantes, tant que c'est un side project.

### Principes produit
1. **Pas de tâche incomplète** : titre, description et échéance sont obligatoires. L'assistant insiste, poliment.
2. **L'assistant propose, tu valides** : s'il déduit une info (ex. « vendredi » → une date), il la montre avant d'enregistrer.
3. **Une question à la fois** : jamais un formulaire déguisé.
4. **Une tâche, ce sont des données ; l'écran n'est qu'une vue** : les regroupements (par statut, par échéance…)
   sont calculés, pas figés dans une structure de colonnes.
5. **Gratuit d'abord** : tout marche sans clé ni carte bancaire (Claude Code via l'abonnement, sinon mode mock).
6. **Web d'abord, mobile ensuite** : la logique métier (`src/core/`) ne dépend ni de React ni de Next.js.

---

## 2. Vision court terme

### Objectif
1. **Thomas utilise Smart Board au quotidien** dès la fin du M1, grâce à la capture via Claude Code.
2. **Vitrine portfolio** : une démo en ligne, un README en anglais, une démarche produit visible.

### Critères de succès
- [ ] Thomas enregistre ses vraies tâches dans Smart Board pendant 2 semaines d'affilée.
- [ ] Une tâche complète s'enregistre en **moins de 30 secondes** via `/tache`.
- [ ] Thomas ajoute une tâche **depuis son téléphone** et la retrouve sur son ordinateur.
- [ ] Une **URL publique** permet de tester l'app sans compte ni installation.
- [ ] Le **README** contient : pitch, captures ou GIF, stack, lancement en local, lien vers ce document.

### Dans le périmètre / hors périmètre
| Dans le périmètre (horizon 3 mois) | Hors périmètre (plus tard) |
|---|---|
| Capture via Claude Code (`/tache`) | Dictée vocale, « Ma journée » |
| Vue liste par échéance, ajout et modification manuels | Priorité, projet, sous-tâches |
| Interface bilingue EN/FR | Champs supplémentaires (le modèle est prêt) |
| Tâches dans le cloud + ajout depuis le téléphone (web) | App mobile native Expo, rappels |
| Assistant dans l'app (Claude Code, puis API Claude) | Statut « en attente » |
| Démo web sur Vercel (données fictives) | Agenda, partage depuis le téléphone |
| Boîte de réception + mails perso | Boîte mail pro, réseaux sociaux |

### Choix de séquencement
1. **M1 — capture via Claude Code d'abord** : c'est le plus rapide pour avoir de la valeur (Thomas s'en sert tout de suite),
   et c'est gratuit. L'app se contente d'afficher les tâches.
2. **M2 — une app utilisable et en ligne** : atelier UI, ajout et modification à la main, démo Vercel et README.
3. **M3 — mes tâches partout, et l'assistant dans l'app** : les tâches passent dans le cloud (ajout depuis le téléphone),
   puis l'assistant arrive dans l'app (Claude Code en local, puis l'API Claude).
4. **M4 — premières intégrations** : boîte de réception et mails perso.

### Où vivent les données
- **M1-M2, sur le PC de Thomas** : un fichier `data/tasks.json`, écrit par Claude Code (`/tache`) et par l'app.
  Il est **exclu de git** (données perso) ; un modèle `data/tasks.example.json` est versionné.
- **À partir du M3, dans le cloud** : Supabase (offre gratuite), accessible depuis le téléphone et l'ordinateur,
  protégé par une connexion. `/tache` écrit alors dans Supabase ; le fichier local est importé une fois.
- **Sur la démo en ligne** : des tâches fictives (`src/mocks/tasks.ts`), modifiables dans le navigateur du visiteur.
- Le code passe toujours par une interface `TaskRepository` (fichier / navigateur / Supabase) : changer de stockage ne touche pas les écrans.

### Un modèle de données simple mais extensible
- **Aujourd'hui** : titre, description, échéance (obligatoires), statut (`à faire` / `en cours` / `fait`), source, dates de création et de mise à jour.
- **Demain** : ajouter un champ (projet, priorité, lien…) = un champ **optionnel** de plus, sans casser les tâches existantes.
- Le fichier porte un numéro de version (`schemaVersion`) pour faire évoluer le format proprement.

### Plan par jalons
Rythme : 3 sessions par semaine. Estimation en sessions (S = 1 session, M = 2, L = 3+).

| Jalon | Objectif | EPICs | Estimation ⚠️ | Date cible ⚠️ |
|---|---|---|---|---|
| **M1 — Capture via Claude Code** | Dicter ses tâches dans Claude Code et les voir dans l'app | E1 | ~7 sessions | **30 novembre 2026** |
| **M2 — App utilisable et en ligne** | Ajout/modification manuels, démo Vercel, README | E2, E3 | ~8 sessions | **18 décembre 2026** |
| **M3 — Partout, avec l'assistant** | Tâches dans le cloud, ajout depuis le téléphone, assistant dans l'app | E4, E5, E6 | ~19 sessions | **7 février 2027** |
| **M4 — Premières intégrations** | Boîte de réception + mails perso | E7, E8 | ~9 sessions | **28 février 2027** |

⚠️ Avec l'accès depuis le téléphone (+5 sessions) et les fêtes de fin d'année, l'horizon glisse de mi-février à **fin février**.
Plan B pour tenir mi-février : reporter les mails (E8) après l'horizon et finir sur la boîte de réception.

**Plan B si on glisse avant la démo du 18 décembre** : on reporte l'atelier UI complet (US-2.1) et on met en ligne
la vue liste du M1 telle quelle.

### Definition of Done (DoD)
Une US est « faite » quand :
- [ ] Tous ses critères d'acceptation sont remplis.
- [ ] Les textes affichés existent **en anglais et en français** (aucun texte en dur hors des fichiers de traduction).
- [ ] La logique métier est dans `src/core/` (sans React), pour être réutilisable sur mobile.
- [ ] Les types (`npm run typecheck`), le linter (`npm run lint`) et les tests (`npm test`) passent.
- [ ] Ça a été vérifié dans le navigateur, sur ordinateur et en largeur mobile.
- [ ] Le statut est mis à jour dans `docs/cockpit/backlog.json`.

---

## 3. Backlog

Format des US : *En tant que … je veux … afin de …*, puis les critères d'acceptation (CA), la taille et le statut.
Statuts possibles : `à faire`, `en cours`, `fait`.

### Jalon M1 — Capture via Claude Code

#### E1 — Capturer ses tâches avec Claude Code
Dicter une tâche dans Claude Code, être relancé sur ce qui manque, la retrouver dans l'app.

- **US-1.1 — Format des tâches** · S · à faire
  En tant que porteur du projet, je veux un format de fichier unique pour les tâches, afin que Claude Code et l'app
  lisent et écrivent les mêmes données.
  - CA : une tâche contient titre, description, échéance, statut, source (`claude-code`, `manual`, plus tard `mail`),
    dates de création et de mise à jour.
  - CA : ajouter un champ optionnel plus tard ne casse pas les tâches existantes (testé) ; le fichier porte un `schemaVersion`.
  - CA : `data/tasks.json` est exclu de git ; `data/tasks.example.json` est versionné.
  - CA : une fonction de `src/core/` valide le fichier et signale clairement une tâche invalide.
- **US-1.2 — Dicter une tâche avec `/tache`** · M · à faire
  En tant qu'utilisateur, je veux écrire `/tache appeler le plombier avant vendredi` dans Claude Code, afin d'enregistrer
  une tâche complète sans formulaire.
  - CA : Claude pose une question par champ manquant (titre, description, échéance), une à la fois.
  - CA : les dates relatives (« vendredi », « dans 2 semaines ») sont converties et affichées en clair pour validation.
  - CA : Claude montre la tâche finale et n'écrit dans `data/tasks.json` qu'après ma validation.
- **US-1.3 — Mettre à jour une tâche avec `/tache`** · S · à faire
  En tant qu'utilisateur, je veux dire « plombier : c'est fait » ou « décale le passeport à lundi », afin de tenir ma liste à jour sans ouvrir l'app.
  - CA : Claude retrouve la tâche, montre le changement et l'applique après validation.
  - CA : en cas de doute entre plusieurs tâches, Claude demande laquelle.
- **US-1.4 — Interface bilingue EN/FR** · S · à faire
  En tant qu'utilisateur, je veux l'app dans ma langue, afin de la comprendre sans effort.
  - CA : la langue suit celle du navigateur, avec l'anglais par défaut ; tous les textes passent par des fichiers `en` / `fr`.
  - Note : à faire avant US-1.5, pour que chaque écran soit bilingue dès sa livraison (voir DoD).
- **US-1.5 — Voir mes tâches par échéance** · M · à faire
  En tant qu'utilisateur, je veux voir mes tâches regroupées par urgence (En retard, Aujourd'hui, Cette semaine, Plus tard),
  afin de savoir quoi faire en premier.
  - CA : l'app lit `data/tasks.json` en local, et les données fictives en mode démo, via `TaskRepository`.
  - CA : les tâches terminées sont repliées en bas.
  - Note : vue provisoire, à revoir lors de l'atelier UI (US-2.1).

### Jalon M2 — App utilisable et en ligne

#### E2 — Gérer ses tâches dans l'app
- **US-2.1 — Atelier UI** · M · à faire
  En tant que porteur du projet, je veux comparer plusieurs maquettes de vues, afin de choisir une interface qui me convainc vraiment.
  - CA : au moins 3 maquettes (dont la liste par échéance), testées sur ordinateur et sur téléphone.
  - CA : décision notée dans le `CLAUDE.md` (vue par défaut, vues secondaires, données affichées).
- **US-2.2 — Ajouter une tâche à la main** · S · à faire
  En tant qu'utilisateur, je veux ajouter une tâche dans l'app sans passer par Claude Code, afin de garder la main quand je n'ai pas le terminal.
  - CA : l'enregistrement est refusé tant qu'un champ obligatoire est vide, avec un message clair.
- **US-2.3 — Modifier une tâche et changer son statut** · S · à faire
  En tant qu'utilisateur, je veux corriger une tâche et la passer à « en cours » ou « faite », afin de suivre l'avancement.
  - CA : les changements sont enregistrés dans le même fichier que celui de `/tache`.

#### E3 — Démo en ligne et vitrine
- **US-3.1 — Démo publique** · S · à faire
  En tant que recruteur, je veux ouvrir la démo depuis un lien, afin de tester l'app sans rien installer.
  - CA : l'app est en ligne sur Vercel (offre gratuite), sur des données fictives.
  - CA : chaque push sur `main` met à jour la démo automatiquement.
- **US-3.2 — Données de démo** · S · à faire
  En tant que visiteur, je veux une liste d'exemple et un bouton « Réinitialiser », afin de tester sans craindre de tout casser.
  - CA : chaque visiteur a sa propre liste (dans son navigateur).
- **US-3.3 — README portfolio** · M · à faire
  En tant que recruteur, je veux comprendre le projet en 1 minute depuis GitHub, afin d'évaluer le travail de Thomas.
  - CA : README en anglais avec pitch, lien de démo, captures ou GIF, stack, lancement en local.
  - CA : la capture via Claude Code est expliquée (c'est un point original du projet).

### Jalon M3 — Partout, avec l'assistant

#### E4 — Finitions
- **US-4.1 — Supprimer une tâche** · S · à faire
  En tant qu'utilisateur, je veux supprimer une tâche devenue inutile, afin de garder une liste propre.
  - CA : une confirmation est demandée avant la suppression.
- **US-4.2 — Repérer les urgences** · S · à faire
  En tant qu'utilisateur, je veux un signal visuel sur les tâches en retard ou dues aujourd'hui, afin de ne rien rater.
- **US-4.3 — Cockpit public** · S · à faire
  En tant que recruteur, je veux voir la vision et le backlog du projet, afin de constater la démarche produit.
  - CA : le cockpit et la vision sont accessibles en ligne depuis le README.
- **US-4.4 — Synchroniser le backlog avec GitHub Issues** · S · à faire
  En tant que porteur du projet, je veux que les US de `backlog.json` apparaissent en Issues, afin de les suivre aussi sur GitHub.
  - CA : un script crée ou met à jour les Issues à partir du JSON (le JSON reste la source de vérité).
  - Note : réutiliser le script de PreDriver Coach. Nécessite le dépôt GitHub.

#### E5 — Mes tâches partout
Retrouver et ajouter ses tâches depuis le téléphone comme depuis l'ordinateur.

- **US-5.1 — Mes tâches dans le cloud** · M · à faire
  En tant qu'utilisateur, je veux que mes tâches soient stockées en ligne, afin d'y accéder depuis n'importe quel appareil.
  - CA : implémentation Supabase (offre gratuite) de `TaskRepository` ; les écrans ne changent pas.
  - CA : un script importe une fois les tâches de `data/tasks.json`.
  - CA : `/tache` écrit dans Supabase.
- **US-5.2 — Me connecter** · M · à faire
  En tant qu'utilisateur, je veux me connecter avec un lien reçu par mail, afin que personne d'autre ne voie mes tâches.
  - CA : connexion Supabase Auth par lien magique, sans mot de passe.
  - CA : chaque utilisateur ne voit que ses propres tâches (règles de sécurité côté base).
  - CA : la démo publique reste accessible sans compte, sur des données fictives.
- **US-5.3 — Ajouter une tâche depuis mon téléphone** · S · à faire
  En tant qu'utilisateur, je veux ouvrir Smart Board sur mon téléphone comme une app et y ajouter une tâche, afin de capturer une idée n'importe où.
  - CA : l'app s'installe sur l'écran d'accueil du téléphone (web app installable).
  - CA : l'ajout manuel est confortable sur petit écran.

#### E6 — L'assistant dans l'app
- **US-6.1 — Dire ma tâche en une phrase dans l'app** · L · à faire
  En tant qu'utilisateur, je veux écrire ma tâche dans l'app comme dans `/tache`, afin de ne pas dépendre du terminal.
  - CA : sur l'ordinateur, l'assistant passe par Claude Code (`claude -p`, abonnement) ; en démo, par le mock.
  - CA : la réponse respecte le contrat `AssistantTurn` de `src/core/assistant.ts`.
- **US-6.2 — Questions de relance et validation** · M · à faire
  En tant qu'utilisateur, je veux que l'assistant me demande ce qui manque puis me montre la tâche, afin de ne rien enregistrer d'incomplet ou de faux.
  - CA : une question par champ manquant ; je peux abandonner à tout moment ; rien n'est créé sans validation.
- **US-6.3 — Passer à l'API Claude** · M · à faire
  En tant qu'utilisateur sur mon téléphone (et visiteur de la démo), je veux le vrai assistant en ligne, afin de dicter une tâche sans mon PC.
  - CA : `LLM_PROVIDER=claude` utilise l'API côté serveur ; la clé n'est jamais envoyée au navigateur.
  - CA : un plafond d'appels par jour évite toute mauvaise surprise sur la facture.
  - ⚠️ L'API Claude est payante à l'usage (quelques centimes par mois avec un petit modèle et un plafond).
- **US-6.4 — Évaluer l'assistant** · M · à faire
  En tant que porteur du projet, je veux un jeu de 20 phrases avec le résultat attendu, afin de mesurer la qualité de l'assistant à chaque changement.
  - CA : un script affiche le taux de champs correctement extraits.

### Jalon M4 — Premières intégrations

#### E7 — Boîte de réception
- **US-7.1 — Valider les tâches proposées** · M · à faire
  En tant qu'utilisateur, je veux voir les tâches proposées (par les mails, plus tard par d'autres sources) et les accepter, modifier ou rejeter,
  afin que rien n'entre dans ma liste sans mon accord.
  - CA : une tâche acceptée passe dans la liste avec sa source ; une tâche rejetée disparaît.

#### E8 — Mails perso
- **US-8.1 — Connecter ma boîte mail perso** · L · à faire
  En tant qu'utilisateur, je veux connecter ma boîte mail perso en lecture seule, afin que l'assistant puisse y repérer des tâches.
  - CA : connexion sécurisée (OAuth), lecture seule, aucun mot de passe stocké par l'app.
  - ⚠️ Fournisseur à confirmer (Gmail, Outlook…) : les API diffèrent.
- **US-8.2 — Repérer les mails qui demandent une action** · L · à faire
  En tant qu'utilisateur, je veux que l'assistant propose une tâche quand un mail demande une action, afin de ne plus rien laisser dormir dans ma boîte.
  - CA : chaque proposition arrive dans la boîte de réception avec un lien vers le mail d'origine.
  - CA : seuls le titre, un résumé et le lien sont conservés, pas le contenu complet du mail.
- **US-8.3 — Couper la connexion** · S · à faire
  En tant qu'utilisateur, je veux déconnecter ma boîte mail en un clic, afin de garder le contrôle sur mes données.
  - CA : la déconnexion révoque l'accès et supprime les jetons stockés.

### Après l'horizon (EPICs seulement, pas encore découpés)
- **E9 — Champs enrichis** : priorité, projet, sous-tâches, estimation de durée, proposés par l'assistant (le modèle est prévu pour).
- **E10 — Dictée vocale** : parler au lieu de taper.
- **E11 — « Ma journée »** : l'assistant propose chaque matin 3 tâches à attaquer.
- **E12 — App mobile native** : Expo, en réutilisant `src/core/` (la web app installable couvre le besoin en attendant).
- **E13 — Rappels** : notification avant l'échéance.
- **E14 — Agenda** : synchroniser les échéances, tâches de suivi de réunion.
- **E15 — Partage vers Smart Board** : créer une tâche depuis n'importe quelle app du téléphone (messages, réseaux, navigateur).

---

## 4. Questions tranchées (2026-11-13)
1. **Support** : web d'abord (Next.js), mobile ensuite, logique métier partagée dans `src/core/`.
2. **Champs obligatoires** : titre, description, échéance.
3. **Saisie** : d'abord via Claude Code (`/tache`, coût couvert par l'abonnement) ; l'ajout manuel dans l'app reste possible.
4. **Assistant** : Claude Code d'abord, API Claude ensuite (pour la version en ligne et le téléphone).
5. **Horizon** : 3 mois, démo en ligne mi-décembre. Rythme : 3 sessions par semaine. ⚠️ Glisse à fin février avec l'accès téléphone.
6. **Langue** : bilingue EN/FR, inscrit dans la DoD.
7. **Vision long terme** : un outil branché sur le quotidien (mails perso, agenda, partage), toujours avec validation.
8. **Mails** : perso uniquement.
9. **Backlog** : `backlog.json` reste la source de vérité ; GitHub Issues générées par script (US-4.4).
10. **UI** : pas de colonnes figées, des vues calculées à partir des données. Vue liste par échéance provisoire ; vrai atelier UI en M2.
11. **Données** : modèle simple (champs obligatoires + statut + source + dates), extensible par champs optionnels.
12. **Statuts** : à faire / en cours / fait.
13. **Appareils** : ordinateur et téléphone → tâches dans le cloud (Supabase, gratuit) à partir du M3.

## 5. Questions ouvertes
- **UI** (atelier US-2.1) : vue par défaut ; aucune des 3 maquettes ne convainc pour l'instant.
- **Horizon** : accepter fin février, ou appliquer le plan B (mails après l'horizon) ?
- **Fournisseur mail perso** (US-8.1).
- **Dépôt GitHub** : à créer avant M2 (Vercel et Issues en ont besoin).
