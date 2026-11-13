# Smart Board — Vision produit

> v0.3 — 2026-11-13. Relue par Thomas (v0.2 du même jour). Les points marqués ⚠️ restent des hypothèses à confirmer en route.
> Le backlog (jalons, EPIC, US, décisions, risques) vit dans `docs/cockpit/backlog.json`, pas ici.
> Cockpit : `docs/cockpit/index.html` (double-clic).

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

### Rythme et estimation
Rythme : 3 sessions par semaine. Tailles : S = 1 session, M = 2, L = 3+.
Jalons, dates cibles et plans B : voir le cockpit (onglets Aperçu et Décisions et risques).

### Definition of Done (DoD)
Une US est « faite » quand :
- [ ] Tous ses critères d'acceptation sont remplis.
- [ ] Les textes affichés existent **en anglais et en français** (aucun texte en dur hors des fichiers de traduction).
- [ ] La logique métier est dans `src/core/` (sans React), pour être réutilisable sur mobile.
- [ ] Les types (`npm run typecheck`), le linter (`npm run lint`) et les tests (`npm test`) passent.
- [ ] Ça a été vérifié dans le navigateur, sur ordinateur et en largeur mobile.
- [ ] Le statut est mis à jour dans `docs/cockpit/backlog.json`.
