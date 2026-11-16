---
name: tache
description: Capture et met à jour les tâches de Thomas dans Smart Board (data/tasks.json) — ajout (questions qui manquent, dates converties, aperçu) et mise à jour (fait, en cours, décaler, préciser), toujours après validation. À utiliser dans le projet smart-board quand Thomas tape « /tache … », « ajoute une tâche », « nouvelle tâche », « ajoute dans la to-do », donne une liste de choses à faire, ou dit qu'une tâche est faite, commencée ou à décaler (« passeport : c'est fait », « décale l'hôtel à lundi »).
---

# /tache — capturer et mettre à jour des tâches dans Smart Board

Promesse du produit : **« Dis-le, c'est rangé. »** Thomas dit ses tâches comme elles lui viennent ;
tu poses les questions qui manquent et tu ranges des tâches **complètes**. Rien n'est écrit sans son « ok ».

Deux usages, à repérer d'après le message :
- **Ajouter** des tâches → section « Déroulé » ci-dessous.
- **Mettre à jour** une tâche existante (« c'est fait », « je commence », « décale », « renomme », « précise ») →
  section « Mettre à jour une tâche ». Un même message peut mêler les deux : traite les mises à jour, puis les ajouts.

Supprimer une tâche n'est pas encore outillé (US-4.1) : dis-le, et propose plutôt de la marquer comme faite.

## Le format d'une tâche
| Champ | Obligatoire | Règle |
|---|---|---|
| `title` | oui | Court, commence par un verbe à l'infinitif (« Refaire le passeport »). |
| `description` | oui | 1 à 2 phrases actionnables : le contexte, la prochaine action concrète, le résultat attendu. |
| `dueDate` | oui | `AAAA-MM-JJ`. Jamais inventée en silence. |
| `category` | non | `perso` ou `pro` (ou ce que Thomas emploie). Déduis-la et affiche-la. |

L'`id`, le statut, la source et les dates de création sont remplis par le code : ne les fournis pas.

## Déroulé
1. **Situer** : lance `date "+%A %d %B %Y"` pour connaître le jour, puis lis `data/tasks.json` s'il existe
   (pour repérer doublons et dépendances).
2. **Découper** : une tâche = une action avec un résultat. Si deux actions se font ensemble
   (ex. passeport + carte d'identité au même rendez-vous), propose de les fusionner ; si une demande cache
   plusieurs actions, propose de la découper. Thomas tranche.
3. **Compléter** : pour chaque tâche, repère ce qui manque. Pose **toutes** les questions en **un seul
   message**, regroupées par tâche et numérotées (Thomas répond en vrac, ex. « 1. … 2. … »).
   - Propose toujours une valeur par défaut quand c'est possible (« je propose ven. 20 nov. »).
   - « Au plus vite », « bientôt » → propose une date concrète, jamais d'échéance floue.
   - Une seule question par point, pas de formulaire déguisé.
4. **Dates** : convertis les dates relatives à partir d'aujourd'hui (« vendredi » = le prochain vendredi,
   « dans 2 semaines », « fin du mois »). Affiche-les toujours avec le jour : « ven. 20 nov. 2026 ».
   Signale une date passée, un week-end (si la tâche demande un guichet ouvert) ou une échéance très proche.
5. **Apporter de la valeur** (sans en faire trop) :
   - les **dépendances** entre tâches (ex. une ETA liée au passeport) ;
   - les **doublons** avec une tâche existante ;
   - un **point d'attention factuel** utile (démarche officielle, délai), avec prudence : renvoie vers le site
     officiel plutôt que d'affirmer un tarif ou un délai précis.
   Propose, ne modifie pas d'office : Thomas peut refuser une alerte (« sans l'alerte »).
6. **Aperçu** : montre un tableau `Catégorie | Titre | Description | Échéance`, puis demande « ok ? ».
   Toute correction → nouvel aperçu. **N'écris qu'après un accord explicite.**
7. **Écrire** avec le script (jamais d'édition à la main de `data/tasks.json` pour un ajout) :
   ```bash
   npm run --silent tasks:add <<'EOF'
   [{"title": "…", "description": "…", "dueDate": "AAAA-MM-JJ", "category": "perso"}]
   EOF
   ```
   Le script valide tout et n'ajoute **rien** si une tâche est incomplète : corrige et relance.
8. **Confirmer** : affiche la liste complète des tâches non terminées, triée par échéance, en signalant
   celles en retard et celles du jour.

## Mettre à jour une tâche
1. **Situer** : comme pour un ajout, `date` puis lecture de `data/tasks.json`.
2. **Comprendre le changement** :
   | Thomas dit… | Changement |
   |---|---|
   | « c'est fait », « terminé », « fini » | `status: "done"` |
   | « je commence », « en cours », « je m'y mets » | `status: "in_progress"` |
   | « à refaire », « pas fini en fait » | `status: "todo"` |
   | « décale à lundi », « pour vendredi », « repousse d'une semaine » | `dueDate` convertie (règles de la section Dates) |
   | « renomme en… », « précise que… » | `title` ou `description` reformulés |
   | « c'est pro / perso » | `category` |
3. **Retrouver la tâche** à partir des mots de Thomas (« passeport », « hôtel »), parmi les tâches **non faites**
   d'abord. Ignore les majuscules et les accents.
   - Une seule candidate : continue.
   - **Plusieurs candidates** (ex. « Londres » → hôtel, ETA, adaptateurs) : liste-les numérotées avec leur échéance
     et demande laquelle. **Ne choisis jamais à sa place.**
   - Aucune : dis-le, montre les tâches les plus proches, et propose d'en créer une.
4. **Aperçu** : un tableau `Tâche | Champ | Avant | Après` (dates avec le jour : « ven. 20 nov. 2026 »), puis « ok ? ».
   Signale une nouvelle échéance passée ou un week-end si la tâche demande un guichet.
5. **Appliquer** après accord explicite, une tâche à la fois, avec le script (jamais d'édition à la main) :
   ```bash
   npm run --silent tasks:update <<'EOF'
   {"id": "t-20261114-1", "changes": {"status": "done"}}
   EOF
   ```
   Le script affiche « avant → après » et ne modifie **rien** si le changement est invalide : corrige et relance.
6. **Confirmer** : comme pour un ajout, la liste des tâches non terminées triée par échéance.

## Règles
- Français, tutoiement, phrases courtes.
- `data/tasks.json` contient des données personnelles : il est exclu de git, ne le commite jamais et
  n'envoie son contenu à aucun service externe.
- Si le fichier est invalide, le script s'arrête sans rien écraser : montre l'erreur à Thomas et
  propose une correction (`npm run tasks:check` pour revérifier).
