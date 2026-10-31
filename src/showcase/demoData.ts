/** Les données de démonstration, toutes ici plutôt que dispersées dans les écrans : un écran de
 *  vitrine doit se lire comme une mise en page, pas comme un tableau de chiffres inventés. */

export interface Order {
  id: string;
  client: string;
  produit: string;
  quantite: number;
  montant: number;
  statut: "payée" | "en attente" | "annulée";
  date: string;
}

export const ORDERS: Order[] = [
  { id: "C-4821", client: "Lemoine SAS", produit: "Abonnement annuel", quantite: 12, montant: 14400, statut: "payée", date: "2026-10-28" },
  { id: "C-4822", client: "Atelier Nord", produit: "Licence poste", quantite: 3, montant: 1080, statut: "payée", date: "2026-10-28" },
  { id: "C-4823", client: "Groupe Vallée", produit: "Abonnement annuel", quantite: 40, montant: 48000, statut: "en attente", date: "2026-10-27" },
  { id: "C-4824", client: "Mercier & Fils", produit: "Module analytique", quantite: 1, montant: 2400, statut: "payée", date: "2026-10-27" },
  { id: "C-4825", client: "Studio Bélier", produit: "Licence poste", quantite: 8, montant: 2880, statut: "annulée", date: "2026-10-26" },
  { id: "C-4826", client: "Cabinet Roux", produit: "Abonnement annuel", quantite: 5, montant: 6000, statut: "payée", date: "2026-10-26" },
  { id: "C-4827", client: "Transports Hary", produit: "Module analytique", quantite: 2, montant: 4800, statut: "en attente", date: "2026-10-25" },
  { id: "C-4828", client: "Ferme du Pré", produit: "Licence poste", quantite: 2, montant: 720, statut: "payée", date: "2026-10-25" },
];

/** Le ton de `Badge` qui dit un statut de commande. Ici et non dans chaque écran : deux écrans
 *  montrent la même colonne, et deux correspondances écrites séparément finissent par ne plus
 *  dire la même chose. */
export function statutTone(statut: Order["statut"]): "up" | "down" | "warning" {
  return statut === "payée" ? "up" : statut === "annulée" ? "down" : "warning";
}

/** Douze points, un par mois — de quoi nourrir les sparklines des tuiles. */
export const REVENUE_TREND = [38, 41, 39, 46, 52, 49, 58, 61, 57, 66, 71, 80];
export const SIGNUPS_TREND = [12, 15, 14, 19, 17, 22, 21, 26, 24, 29, 33, 31];
export const CHURN_TREND = [6, 5, 7, 6, 8, 7, 6, 5, 6, 4, 5, 4];
