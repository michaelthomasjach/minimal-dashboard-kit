import type { ReactNode } from "react";
import { LqThemeProvider, type LqSurface } from "@michaelthomasjach/liseuse-dashboard-kit";
import "@michaelthomasjach/liseuse-dashboard-kit/style.css";
// Les deux polices du thème, servies avec l'application plutôt que par Google Fonts : rien n'est
// demandé à un tiers au chargement de la page, et le rendu ne dépend pas d'un réseau externe.
// Inter pour le texte (400 à 700), Montserrat pour les petits titres en capitales (500 et 600).
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "./minimal.css";

/**
 * Le thème « minimal », posé sur un sous-arbre.
 *
 * C'est l'unique point d'entrée de cette couche, et il tient en trois choses : la feuille du kit,
 * la feuille de variables de ce thème, et la classe `mdk` qui donne à la seconde la spécificité
 * qu'il lui faut pour gagner sur la première (voir `minimal.css` pour le détail du calcul).
 *
 * `palette` n'est pas exposé. Le kit en a deux — « eink » et « color » — et ce thème les remplace
 * toutes les deux : laisser le choix ouvert donnerait un réglage qui, selon sa valeur, ne change
 * rien. Il reste fixé à « color » pour que les composants qui se demandent s'ils sont sur une
 * liseuse répondent non, ce qui est le cas.
 *
 * `surface` reste ouvert, parce que clair et sombre sont deux vraies variantes de ce thème-ci,
 * écrites l'une comme l'autre dans `minimal.css`.
 */
export interface MinimalThemeProps {
  /** `"light"` (défaut) ou `"dark"`. */
  surface?: LqSurface;
  children: ReactNode;
}

export function MinimalTheme({ surface = "light", children }: MinimalThemeProps) {
  return (
    <LqThemeProvider palette="color" surface={surface} font="inter" className="mdk">
      {children}
    </LqThemeProvider>
  );
}
