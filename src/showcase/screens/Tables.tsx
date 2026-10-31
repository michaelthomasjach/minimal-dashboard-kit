import { Card, Heading, Text } from "@michaelthomasjach/liseuse-dashboard-kit";
import { DataTable, Badge, type DataTableColumn } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS, statutTone, type Order } from "../demoData";

const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const COLUMNS: DataTableColumn<Order>[] = [
  { id: "id", header: "Commande", accessor: (o) => o.id, sortValue: (o) => o.id, width: "7rem" },
  { id: "date", header: "Date", accessor: (o) => new Date(o.date).toLocaleDateString("fr-FR"), sortValue: (o) => o.date, width: "8rem" },
  { id: "client", header: "Client", accessor: (o) => o.client, sortValue: (o) => o.client },
  { id: "produit", header: "Produit", accessor: (o) => o.produit, sortValue: (o) => o.produit },
  { id: "quantite", header: "Qté", accessor: (o) => o.quantite, sortValue: (o) => o.quantite, align: "right", width: "5rem" },
  { id: "montant", header: "Montant", accessor: (o) => euro(o.montant), sortValue: (o) => o.montant, align: "right", width: "8rem" },
  {
    id: "statut",
    header: "Statut",
    accessor: (o) => <Badge tone={statutTone(o.statut)}>{o.statut}</Badge>,
    sortValue: (o) => o.statut,
    width: "8rem",
  },
];

/**
 * L'écran des tableaux, et **le premier à faire apparaître un manque**.
 *
 * `DataTable` trie par colonne et s'arrête là : pas de pagination, pas de sélection de lignes, pas
 * de filtre, pas d'export. Sur huit lignes de démonstration cela ne se voit pas ; sur les milliers
 * de lignes qu'un vrai tableau de bord affiche, c'est le composant qui décide que l'écran n'est
 * plus utilisable. C'est le premier point du plan de travail noté dans le comparatif du kit, et cet
 * écran est là pour qu'on ne l'oublie pas : il se remplira à mesure que le composant grandit.
 */
export function Tables() {
  return (
    <div className="mdk-screen">
      <header className="mdk-screen__head">
        <div>
          <Heading level={1}>Tableaux</Heading>
          <Text muted size="sm">
            `DataTable` du kit, trié par colonne. Cliquer un en-tête inverse l'ordre.
          </Text>
        </div>
      </header>

      <Card title="Commandes" meta={`${ORDERS.length} lignes`}>
        <DataTable columns={COLUMNS} rows={ORDERS} rowKey={(o) => o.id} />
      </Card>

      <Card title="Ce qui manque encore" bare>
        <Text size="sm" muted>
          Pagination, sélection de lignes, filtre, en-tête figé et export sont absents du composant.
          Ils se construisent dans le kit, pas ici : un contournement local ferait diverger les deux
          dépôts, et c'est précisément ce que cette couche cherche à éviter.
        </Text>
      </Card>
    </div>
  );
}
