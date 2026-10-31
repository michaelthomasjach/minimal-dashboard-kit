import { Card, Button } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ScreenHead } from "../Specimen";
import { StatCard, DataTable, Badge, type DataTableColumn } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS, REVENUE_TREND, SIGNUPS_TREND, CHURN_TREND, statutTone, type Order } from "../demoData";

const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const RECENT: DataTableColumn<Order>[] = [
  { id: "id", header: "Commande", accessor: (o) => o.id, sortValue: (o) => o.id, width: "7rem" },
  { id: "client", header: "Client", accessor: (o) => o.client, sortValue: (o) => o.client },
  { id: "montant", header: "Montant", accessor: (o) => euro(o.montant), sortValue: (o) => o.montant, align: "right" },
  {
    id: "statut",
    header: "Statut",
    accessor: (o) => <Badge tone={statutTone(o.statut)}>{o.statut}</Badge>,
    sortValue: (o) => o.statut,
    width: "8rem",
  },
];

/**
 * L'écran de référence du tableau de bord : une rangée de valeurs, puis un bloc de détail.
 *
 * Il existe pour prouver le thème sur de vrais composants du kit — `StatCard`, `DataTable`,
 * `Card`, `Badge`, `Button` — plutôt que sur des rectangles de démonstration. Si les variables
 * sont justes, ces cinq-là s'accordent sans qu'on écrive une seule règle ici ; et c'est bien ce
 * qu'on veut vérifier, puisque c'est la promesse de toute la couche.
 */
export function Overview() {
  return (
    <div className="mdk-screen">
      <ScreenHead
        title="Vue d'ensemble"
        intro="Activité commerciale des douze derniers mois."
        actions={<Button>Exporter</Button>}
      />

      <div className="mdk-grid mdk-grid--stats">
        <StatCard label="Revenu mensuel" value={euro(80000)} delta={12.4} caption="vs. mois précédent" sparklineData={REVENUE_TREND} />
        <StatCard label="Nouveaux clients" value="31" delta={-6.1} caption="vs. mois précédent" sparklineData={SIGNUPS_TREND} />
        <StatCard label="Attrition" value="4,0 %" delta={-1.2} caption="vs. mois précédent" sparklineData={CHURN_TREND} />
        <StatCard label="Panier moyen" value={euro(2580)} delta={3.8} caption="vs. mois précédent" />
      </div>

      <Card title="Commandes récentes" meta={`${ORDERS.length} sur la période`}>
        <DataTable columns={RECENT} rows={ORDERS.slice(0, 6)} rowKey={(o) => o.id} />
      </Card>
    </div>
  );
}
