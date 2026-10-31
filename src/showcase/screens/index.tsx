import type { ReactElement } from "react";
import { Overview } from "./Overview";
import { Tables } from "./Tables";
import { Forms } from "./Forms";

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
