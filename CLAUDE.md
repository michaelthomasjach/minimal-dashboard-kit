# minimal-dashboard-kit — contexte pour Claude Code

Ce fichier existe pour qu'une session ouverte dans ce dossier parte avec ce qui a déjà été décidé,
au lieu de le redécouvrir ou de le remettre en cause. Il a été écrit à la fin de la session qui a
créé le dépôt (2026-10-31).

## Ce que ce dépôt est, et surtout ce qu'il n'est pas

Une **couche de thème** par-dessus `@michaelthomasjach/liseuse-dashboard-kit`, plus la vitrine qui
la montre. Ce n'est **pas** une seconde bibliothèque de composants. Le kit garde la logique ; ici on
ne décide que de l'apparence et des écrans.

Le dépôt du kit est le voisin : `../Dashboard liseuse` (nom npm
`@michaelthomasjach/liseuse-dashboard-kit`, publié sur GitHub Packages, pas sur npm public).

## La décision d'architecture, et pourquoi elle a été prise

Michael voulait « reprendre les mêmes composants que le kit, mais avec le langage visuel d'un
tableau de bord d'administration ». Trois chemins ont été posés :

1. une couche de thème par-dessus le kit — quelques jours ;
2. une bibliothèque autonome réécrivant les ~200 composants — des mois, deux bases à maintenir ;
3. une troisième palette dans l'union `LqPalette` du kit — le moins cher, mais le look devient une
   surface publique du paquet publié et ne peut plus diverger.

**Il a choisi le 1.** Ne rouvre pas ce débat sans raison nouvelle.

## Comment la couche tient — à ne pas casser

Aucun composant du kit n'écrit de couleur, de rayon ni d'espacement en dur : les ~200 lisent une
soixantaine de variables `--lq-*` posées sur leur ancêtre `.lq-root`. `src/theme/minimal.css` les
redéfinit toutes sous un sélecteur **strictement plus spécifique** :

```
.mdk.lq-root[data-lq-palette][data-lq-surface="light"]  (0,4,0)  >  .lq-root[data-lq-palette="color"][data-lq-surface="light"]  (0,3,0)
.mdk.lq-root                                            (0,2,0)  >  .lq-root                                                    (0,1,0)
```

Strictement plus spécifique, et non « plus loin dans la cascade » : l'ordre des imports est ce qu'un
bundler réorganise tout seul le jour où il découpe ses chunks autrement, et une couche qui en dépend
casse sans prévenir. Les `[data-lq-palette]` sans valeur sont là pour acheter un point de
spécificité sans restreindre à une palette — le thème **remplace** `eink` comme `color`.

La classe `mdk` est posée par `MinimalTheme` (`src/theme/index.tsx`), seul point d'entrée.

## Les règles de frontière

| Ce dont il s'agit | Où ça va |
|---|---|
| Logique d'un composant, correctif, composant manquant | **le kit**, `../Dashboard liseuse` |
| Couleur, rayon, espacement, échelle typographique | ici, `src/theme/minimal.css` |
| Refonte d'anatomie (densité, chrome, position d'un libellé) | ici, un composant dans `src/theme/` qui enveloppe celui du kit |
| Écran, navigation, données de démonstration | ici, `src/showcase/` |

Une variable ne peut pas **déplacer** un élément : tant qu'il s'agit de couleur, de taille ou
d'espace, c'est `minimal.css` ; dès qu'un libellé doit passer à gauche, c'est un composant.

**Aucun contournement local d'un manque du kit.** Si `DataTable` n'a pas de pagination, on l'ajoute
dans le kit, pas ici. C'est la règle qui justifie toute l'architecture : la contourner une fois fait
diverger les deux dépôts et la couche perd sa raison d'être.

Corollaire : si `src/showcase/showcase.css` se met à viser un sélecteur `.lq-…`, c'est le signe
qu'il manquait une variable, ou qu'une refonte d'anatomie est à faire.

## La convention des écrans

`src/showcase/screens/index.tsx` est un **registre unique** : une entrée y produit à la fois
l'élément de menu et la route. Elles ne peuvent donc pas se contredire — c'est ce qui compte quand
les écrans se comptent par dizaines. Ajouter un écran = écrire le composant, l'inscrire là.

`HashRouter` et non `BrowserRouter` : un rafraîchissement sur `/tableaux` rend un 404 chez tout
hébergeur statique qui ne réécrit pas vers `index.html`, GitHub Pages le premier. Une ligne à
changer le jour où c'est servi par autre chose.

## Le langage visuel

**Décision du 2026-10-31 (remplace la première pose) :** Michael veut le rendu de
`pages.revox.io` (gabarit « Pages », variante condensed) **à l'identique**, polices, ombres et
couleurs comprises. Le premier jet, un système original « de la même famille » (neutres ardoise,
accent indigo), est abandonné.

La méthode, qui tient aussi la ligne juridique (Pages est un produit payant) : on **mesure** les
valeurs calculées de ses éléments rendus (`getComputedStyle` en Chrome headless sur ses pages de
démonstration), puis on les reporte dans nos variables. On ne recopie **ni** sa feuille de style,
**ni** ses gabarits HTML, **ni** ses images, **ni** sa fonte d'icônes `pages-icon`. Montserrat et
Inter sont des polices libres (OFL), elles peuvent être chargées.

Relevés de référence : fond `#f4f4f4`, texte `#4b4b4b` en Inter 14 px (espacement 0,01 em), texte
atténué `rgba(33,33,33,.62)`, cartes blanches sans bordure avec ombre
`0 1px 2px rgba(33,33,33,.14), 0 0 1px rgba(0,0,0,.14)`, rayon 2 px (cartes, champs) et 3 px
(boutons, étiquettes), primaire `#7252d3`, complete `#0072ec`, succès `#19ad79`, danger `#d83c31`,
avertissement `#ffd945`, barre latérale `#2b303b` / texte `#929aac`. Petits titres (titre de carte,
en-tête de tableau, onglets, étiquettes) en **Montserrat 500, 10,5 px, majuscules, espacement
0,06 em**. Titres en Inter **500**. Le gabarit n'a pas de surface sombre : la nôtre est dérivée de sa
barre latérale.

Depuis le kit **v0.181.0**, ce qui était écrit en dur dans ses composants passe par des variables
**optionnelles** (jamais déclarées dans son `tokens.css`, lues avec pour repli l'ancienne valeur) :
`--lq-font-weight-*`, `--lq-label-*` (petits titres en capitales), `--lq-caption-*` (titre de
Card, onglet, libellé de StatCard), `--lq-control-border-width`, `--lq-button-*`,
`--lq-color-panel-border`, et l'attribut `data-lq-region="sidebar"` sous lequel `minimal.css`
redéfinit la palette de la barre latérale. La liste fait foi en fin de
`../Dashboard liseuse/src/theme/tokens.css`. Le même correctif a fait suivre le thème dans les
portails (Modal, Popover, Tooltip…), qui retombaient avant sur les valeurs du kit.

Écarts qui restent avec le gabarit : sa barre latérale est un rail d'icônes de 70 px qui s'ouvre au
survol (une **anatomie**, pas une couleur : un mode « condensé » de `SidebarLayout` dans le kit) ;
les tailles de police des composants sont encore en `rem` en dur (corps à 14,4 px au lieu de 14) ;
les badges du kit sont en pilule là où le gabarit met des étiquettes à 3 px.

## Où on en est

- Coquille, registre et trois écrans de référence — Vue d'ensemble, Tableaux, Formulaires — choisis
  pour tomber pile sur les trous du kit et les **montrer** au lieu de les masquer.
- Treize planches (`src/showcase/screens/components/`) : **chaque export public du kit** y est montré
  vivant, famille par famille, avec le gabarit `src/showcase/Specimen.tsx`. Données déterministes.
- Thème calé sur les valeurs mesurées de `pages.revox.io` (voir plus haut), kit en v0.181.0.

Vérifié : les 16 écrans rendus dans Chrome headless, en clair et en sombre, sans erreur
d'exécution — la seule exception connue est un avertissement React de `WorldExposureMap` (trois
pays de `world-atlas` sans `id`, clés en double), à corriger dans le kit.

### Manques connus, à combler **dans le kit**

Par ordre d'utilité, repris du comparatif complet qui vit dans le dépôt voisin
(`../Dashboard liseuse/docs/comparatif-revox.md` — à lire avant de planifier quoi que ce soit) :

1. `Radio` / `RadioGroup` — le seul contrôle de formulaire standard absent. `SegmentedControl` ne le
   remplace pas : un groupe radio porte des libellés longs et s'empile verticalement.
2. `DataTable` : pagination, puis sélection de lignes, filtre, en-tête figé, export.
3. `ButtonGroup` et barre d'outils, cercle de progression, onglets verticaux.

Défauts relevés en montant les planches, à corriger dans le kit aussi :
- `DatePicker` / `DateRangePicker` / `DateTimePicker` : le déclencheur ne fixe pas `color`, la
  valeur s'affiche en noir sur la surface sombre.
- `IconButton` : le padding natif du bouton n'est pas remis à zéro, l'icône est rétrécie.
- `Notification` : un « 0 » parasite avec `autoDismissMs: 0` (`{autoDismissMs && …}`).
- Pages (`LoginPage`, `SignUpPage`, `NotFoundPage`, layouts) en `100vh` : elles ne tiennent pas dans
  un cadre.
- Nombres formatés à l'anglaise sans prop pour changer (`ComparisonCard`, `HoldingCard`,
  `PortfolioSummaryWidget`, `MarketMoversWidget`, `LevelMeter`, dates de `CandlestickChart`).
- Libellés rognés ou superposés : `MatrixChart`, `DeltaChart`, axe des prix de `ChartWorkspace`,
  bouton plein écran de `SankeyChart` ; `ChartWorkspace` ignore `layout="desktop"` sous 1500 px.
- `Carousel` sans image : la flèche recouvre le titre, le point actif est invisible.

### À faire dans ce dépôt

- Le dépôt distant n'existe pas encore. `gh` n'est pas installé sur ce poste, donc c'est à Michael
  de le créer, puis `git remote add origin …` et `git push -u origin master`.
- Le cockpit connaît ce dossier (projet `minimal-dashboard-kit`, enregistré le 2026-10-31).
- Rien ne décide encore si ce paquet sera publié. Il est `private: true` pour l'instant.

## Conventions de travail

- `npm install` a besoin de `GITHUB_TOKEN` dans le shell (le kit est sur GitHub Packages). Il est
  déjà exporté sur le poste de Michael. Ne jamais écrire un jeton réel dans `.npmrc`, qui est
  commité — la valeur reste `${GITHUB_TOKEN}`.
- `npm run build` lance le typecheck avant de construire. `npm run typecheck` seul existe aussi.
- Commits en conventional commits, corps explicatif en français, et on commite et pousse à la fin
  de chaque tâche terminée — c'est une consigne permanente de Michael.
- La règle « bump de version à chaque commit » vient du dépôt du kit, où la version est affichée
  dans Storybook. Elle n'a pas été reprise ici et ce paquet est privé ; à trancher avec lui si la
  question se pose.
- Michael écrit en français et attend des réponses en français.

## Vérifier une modification visuelle

Ne pas se contenter du typecheck pour un changement de thème : construire puis lire les variables
**calculées** dans un vrai navigateur, c'est la seule preuve que la couche gagne. La méthode qui a
servi : `npm run build`, un petit serveur statique sur `dist/`, Chrome en `--headless=new` piloté en
CDP (`Runtime.evaluate` avec `getComputedStyle(document.querySelector('.lq-root'))`), plus
`Page.captureScreenshot`. Aucune dépendance à ajouter — Node a `WebSocket` en global.
