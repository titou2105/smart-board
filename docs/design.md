---
# Lu par build.mjs. Accent : un nom (indigo, teal, pink, blue, orange, violet) ou une couleur "#rrggbb".
# Avec une couleur sur mesure, ajoute accentDark (version claire pour le mode sombre).
accent: indigo
---

# Smart Board — Design

> Déclinaison du design system commun (`~/projets/harnais/global/skills/design/`, « Calme & précis »).
> Tout ce qui n'est pas écrit ici suit la base : `principles.md` et `tokens.json`.
> Thème généré : `node ~/projets/harnais/global/skills/design/build.mjs` (ne pas retoucher le fichier généré).
> Atelier qui a fixé ces choix : `docs/design/atelier.html` (US-2.1, 2026-11-16), direction **A** retenue.

## Personnalité
3 adjectifs qui guident les arbitrages visuels : **rangé**, **rassurant**, **rapide**.
En une phrase : en ouvrant l'app, Thomas voit tout de suite où il en est cette semaine et quoi faire ensuite,
sans bruit ; ajouter une tâche se fait en une phrase, à une main, sur le téléphone.

## Accent
- Couleur : **indigo** (accent par défaut de la base) — calme et pro, cohérent avec un outil qu'on ouvre plusieurs fois
  par jour. Choix par défaut : teal et violet ont été montrés, Thomas n'a pas tranché ; à revoir sans coût (une ligne ici).
- Où elle apparaît : l'action principale (« Dis ta tâche… », « Ranger la tâche »), la case cochée, le badge
  « En cours », la barre de progression de la semaine, le filtre actif, le focus. Nulle part ailleurs.

## Écrans clés
| Écran | Action principale | Données affichées | États prévus |
|---|---|---|---|
| **Mes tâches** (vue par défaut, direction A) | Ajouter une tâche (« Dis ta tâche… », barre fixe en bas sur téléphone, champ en haut sur ordinateur) | Bilan de la semaine (faites / prévues, en cours) ; filtre Tout / Perso / Pro ; sections En retard, Aujourd'hui, Dans les 7 jours, Plus tard ; par ligne : case ronde, titre, échéance relative (« Demain », « ven. 20 nov. »), badge « En cours » plein, catégorie ; tâches faites repliées en bas | chargement (squelette), vide (« Rien à faire ici »), erreur (fichier invalide), succès (toast « Bien joué ✓ ») |
| **Détail d'une tâche** (feuille montante sur téléphone, panneau latéral sur ordinateur) | Marquer comme faite | Titre, description, échéance en toutes lettres, statut, origine (assistant ou à la main) ; actions secondaires « Commencer », « Demain » | — |
| **Nouvelle tâche** (feuille / panneau) | Ranger la tâche | Conversation : l'assistant demande ce qui manque (échéance, contexte), réponses rapides en puces, aperçu final avec la catégorie | question suivante, aperçu, annulation |

Interactions retenues : cocher en un geste depuis la liste ; tout le reste (en cours, reporter, modifier) depuis le détail.

## Choix spécifiques (écarts à la base)
- 2026-11-16 — Le badge « En cours » est **plein** (fond accent) et non sur fond doux. Pourquoi : Thomas veut voir
  d'un coup d'œil ce qui est commencé ; c'est un état central de son usage, pas un détail.
- 2026-11-16 — Police : la variable de `next/font` s'appelle `--font-inter` (et non `--font-sans` comme dans la
  procédure du skill), puis `globals.css` fait `--font-sans: var(--font-inter)`. Pourquoi : `--font-sans: var(--font-sans)`
  dans `@theme inline` se référence lui-même et l'app retombait en police serif (bug vu à l'US-1.4).
- 2026-11-16 — Les lignes de tâches sont regroupées dans une carte par section (pas une carte par tâche). Pourquoi :
  densité « Calme & précis » avec 10 à 30 tâches ouvertes, tout en gardant les sections lisibles.
