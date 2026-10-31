import type { ReactElement } from "react";
import { Overview } from "./Overview";
import { Tables } from "./Tables";
import { Forms } from "./Forms";
import { Primitives } from "./components/Primitives";
import { Containers } from "./components/Containers";
import { Icons } from "./components/Icons";
import { Feedback } from "./components/Feedback";
import { Fields } from "./components/Fields";
import { DatesSliders } from "./components/DatesSliders";
import { Finance } from "./components/Finance";
import { Charts } from "./components/Charts";
import { MarketCharts } from "./components/MarketCharts";
import { HomeWidgets } from "./components/HomeWidgets";
import { ToolWidgets } from "./components/ToolWidgets";
import { MapsAudio } from "./components/MapsAudio";
import { Pages } from "./components/Pages";

/**
 * Le registre des écrans — **la convention centrale de ce dépôt**.
 *
 * Une entrée ici produit à la fois l'élément de navigation et la route. Les deux ne peuvent donc
 * pas diverger, et ajouter un écran est un seul geste : écrire le composant, l'inscrire ici. Un
 * tableau de bord de démonstration finit toujours par compter quarante écrans, et c'est exactement
 * à cette taille qu'une liste de `<Route>` d'un côté et un tableau de liens de l'autre commencent à
 * se contredire — un écran accessible qui n'est plus dans le menu, un lien de menu vers une route
 * supprimée.
 *
 * `group` est le seul regroupement : la barre latérale replie les écrans par groupe, dans l'ordre
 * où les groupes apparaissent ici.
 */
export interface Screen {
  id: string;
  label: string;
  /** Sans barre oblique de tête : elle est ajoutée par le routeur. */
  path: string;
  group: string;
  render: () => ReactElement;
}

export const SCREENS: Screen[] = [
  { id: "overview", label: "Vue d'ensemble", path: "", group: "Tableau de bord", render: () => <Overview /> },
  { id: "tables", label: "Tableaux", path: "tableaux", group: "Données", render: () => <Tables /> },
  { id: "forms", label: "Formulaires", path: "formulaires", group: "Données", render: () => <Forms /> },

  // Les planches : chaque export du kit, famille par famille, dans le thème.
  { id: "c-primitives", label: "Primitives", path: "composants/primitives", group: "Composants · base", render: () => <Primitives /> },
  { id: "c-containers", label: "Conteneurs", path: "composants/conteneurs", group: "Composants · base", render: () => <Containers /> },
  { id: "c-icons", label: "Icônes", path: "composants/icones", group: "Composants · base", render: () => <Icons /> },
  { id: "c-feedback", label: "Retours", path: "composants/retours", group: "Composants · base", render: () => <Feedback /> },
  { id: "c-fields", label: "Champs", path: "composants/champs", group: "Composants · saisie", render: () => <Fields /> },
  { id: "c-dates", label: "Dates et curseurs", path: "composants/dates", group: "Composants · saisie", render: () => <DatesSliders /> },
  { id: "c-finance", label: "Finance", path: "composants/finance", group: "Composants · données", render: () => <Finance /> },
  { id: "c-charts", label: "Graphiques", path: "composants/graphiques", group: "Composants · données", render: () => <Charts /> },
  { id: "c-market", label: "Graphiques de marché", path: "composants/marche", group: "Composants · données", render: () => <MarketCharts /> },
  { id: "c-home", label: "Widgets maison", path: "composants/widgets-maison", group: "Composants · widgets", render: () => <HomeWidgets /> },
  { id: "c-tools", label: "Widgets outils", path: "composants/widgets-outils", group: "Composants · widgets", render: () => <ToolWidgets /> },
  { id: "c-maps", label: "Cartes, audio, planning", path: "composants/cartes-audio", group: "Composants · widgets", render: () => <MapsAudio /> },
  { id: "c-pages", label: "Pages et mises en page", path: "composants/pages", group: "Composants · pages", render: () => <Pages /> },
];

/** Les groupes, dans l'ordre de première apparition. */
export function screenGroups(): { group: string; screens: Screen[] }[] {
  const order: string[] = [];
  const byGroup = new Map<string, Screen[]>();
  for (const screen of SCREENS) {
    if (!byGroup.has(screen.group)) {
      byGroup.set(screen.group, []);
      order.push(screen.group);
    }
    byGroup.get(screen.group)!.push(screen);
  }
  return order.map((group) => ({ group, screens: byGroup.get(group)! }));
}
