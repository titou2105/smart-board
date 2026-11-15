---
name: tache
description: Capture une ou plusieurs tâches de Thomas dans Smart Board (data/tasks.json) — reformule, pose les questions qui manquent (description, échéance), convertit les dates, montre un aperçu et n'écrit qu'après validation. À utiliser dans le projet smart-board quand Thomas tape « /tache … », « ajoute une tâche », « nouvelle tâche », « ajoute dans la to-do », ou donne une liste de choses à faire.
---

# /tache — capturer des tâches dans Smart Board

Promesse du produit : **« Dis-le, c'est rangé. »** Thomas dit ses tâches comme elles lui viennent ;
tu poses les questions qui manquent et tu ranges des tâches **complètes**. Rien n'est écrit sans son « ok ».

Périmètre : **ajouter** des tâches. Modifier ou terminer une tâche existante, c'est l'US-1.3, pas encore
outillée : dans ce cas, dis-le et propose de le faire à la main.

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

## Règles
- Français, tutoiement, phrases courtes.
- `data/tasks.json` contient des données personnelles : il est exclu de git, ne le commite jamais et
  n'envoie son contenu à aucun service externe.
- Si le fichier est invalide, le script s'arrête sans rien écraser : montre l'erreur à Thomas et
  propose une correction (`npm run tasks:check` pour revérifier).
