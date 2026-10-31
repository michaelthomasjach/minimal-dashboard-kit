import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { DataTable, Badge, PriceChangeTag, Sparkline, type DataTableColumn } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS, HOLDINGS, statutTone, type Order, type Holding } from "../../showcase/demoData";

const euro = (n: number, digits = 0) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: digits, maximumFractionDigits: digits });
const pct = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;
const date = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

/** Les colonnes d'une liste de commandes : toutes triables, montants et quantités à droite. */
const ORDER_COLUMNS: DataTableColumn<Order>[] = [
  { id: "id", header: "N°", accessor: (o) => o.id, sortValue: (o) => o.id, width: "6rem" },
  { id: "client", header: "Client", accessor: (o) => o.client, sortValue: (o) => o.client },
  { id: "produit", header: "Produit", accessor: (o) => o.produit, sortValue: (o) => o.produit },
  { id: "quantite", header: "Qté", accessor: (o) => o.quantite, sortValue: (o) => o.quantite, align: "right", width: "5rem" },
  { id: "montant", header: "Montant", accessor: (o) => euro(o.montant), sortValue: (o) => o.montant, align: "right" },
  { id: "statut", header: "Statut", accessor: (o) => <Badge tone={statutTone(o.statut)}>{o.statut}</Badge>, sortValue: (o) => o.statut },
  { id: "date", header: "Date", accessor: (o) => date(o.date), sortValue: (o) => o.date, align: "right" },
];

/**
 * Le tableau de données du kit : triable, défilant à l'horizontale quand il manque de place.
 */
const meta = {
  title: "Composants/Finance/DataTable",
  component: DataTable<Order>,
  parameters: {
    docs: {
      description: {
        component: [
          "Tableau de données **triable** et **défilant à l'horizontale** quand l'écran est étroit : commandes, transactions, positions.",
          "",
          "**Quand l'utiliser** — une liste d'enregistrements de même forme, à lire ou comparer colonne par colonne. Pour quelques lignes de chiffres sous un titre, une `Panel` avec des `PanelRow` est plus légère ; pour des valeurs par période (mois en colonnes), `PeriodTable` ; pour une liste de positions en cartes, `WatchlistWidget`.",
          "",
          "**Colonnes** — `columns` décrit chaque colonne : `id`, `header` (le titre, passé en petites capitales par le thème), `accessor` (ce que la cellule affiche, n'importe quel `ReactNode` : une pastille, un écart, une courbe), `align` (`left` par défaut, `right` pour les nombres), `width`. `rowKey` donne la clé React de chaque ligne.",
          "",
          "**Tri** — une colonne est triable dès qu'elle a un `sortValue`, qui renvoie la valeur à comparer (nombre ou texte — pas la cellule formatée). Un clic sur l'en-tête trie en **croissant**, un deuxième en **décroissant**, un troisième **rend l'ordre d'origine**. Deux nombres se comparent numériquement, le reste par `localeCompare`. L'en-tête trié porte `aria-sort`. Le tri est interne au composant : il n'est ni contrôlable ni notifié.",
          "",
          "**Lignes** — avec `onRowClick`, chaque ligne prend un fond au survol et un clic la renvoie entière. Sans ligne, le tableau affiche `emptyMessage` (« Aucune donnée » par défaut).",
          "",
          "**Clavier** — ni les en-têtes triables ni les lignes cliquables ne sont focalisables : le tri et le clic de ligne ne se font qu'à la souris.",
          "",
          "**À savoir** — dans une colonne triable alignée à droite, l'en-tête ne tombe pas au droit des cellules : la place réservée à la flèche de tri (14 px et un écart de 4) le décale de 18 px vers la gauche (voyez « Montant » et « Date »).",
          "",
          "**Ce qui manque** — pas de pagination, de sélection de lignes, de filtre, d'en-tête figé ni d'export. Ce sont des manques connus, à combler **dans le kit** et non autour de lui.",
          "",
          "**Thème** — `--lq-row-font-size` (13 px, un cran sous le corps), `--lq-label-font`, `--lq-label-size`, `--lq-label-tracking` (en-têtes), `--lq-color-border` (filet sous l'en-tête), `--lq-color-border-subtle` (filets de lignes), `--lq-color-hover` (survol), `--lq-space-2`, `--lq-space-3`.",
        ].join("\n"),
      },
    },
  },
  args: {
    columns: ORDER_COLUMNS,
    rows: ORDERS,
    rowKey: (o: Order) => o.id,
    onRowClick: fn(),
    emptyMessage: "Aucune commande",
  },
  argTypes: {
    columns: { control: false },
    rows: { control: "object" },
    rowKey: { control: false },
    emptyMessage: { control: "text", table: { defaultValue: { summary: '"Aucune donnée"' } } },
  },
} satisfies Meta<typeof DataTable<Order>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Empty: Story = {
  name: "Vide",
  args: { rows: [] },
  parameters: { docs: { description: { story: "Sans ligne, une cellule pleine largeur porte `emptyMessage`. Écrivez-le pour le contexte : « Aucune commande ce mois-ci » vaut mieux que « Aucune donnée »." } } },
};

const POSITION_COLUMNS: DataTableColumn<Holding>[] = [
  { id: "symbol", header: "Titre", accessor: (h) => h.symbol, sortValue: (h) => h.symbol, width: "6rem" },
  { id: "name", header: "Société", accessor: (h) => h.name, sortValue: (h) => h.name },
  { id: "trend", header: "Tendance", accessor: (h) => <Sparkline data={h.sparklineData} width={80} height={24} colorByTrend /> },
  { id: "quantity", header: "Quantité", accessor: (h) => h.quantity, sortValue: (h) => h.quantity, align: "right" },
  { id: "price", header: "Cours", accessor: (h) => euro(h.price, 2), sortValue: (h) => h.price, align: "right" },
  { id: "value", header: "Valorisation", accessor: (h) => euro(h.price * h.quantity), sortValue: (h) => h.price * h.quantity, align: "right" },
  { id: "change", header: "Séance", accessor: (h) => <PriceChangeTag value={h.change} format={pct} />, sortValue: (h) => h.change, align: "right", width: "7rem" },
];

export const Positions: Story = {
  name: "Positions, avec cellules riches",
  render: () => <DataTable columns={POSITION_COLUMNS} rows={HOLDINGS} rowKey={(h) => h.id} />,
  parameters: {
    docs: {
      description: {
        story:
          "Une cellule peut contenir n'importe quel composant — ici une `Sparkline` et un `PriceChangeTag`. La colonne « Valorisation » trie sur un calcul (`price × quantity`), « Tendance » n'a pas de `sortValue` et ne se trie pas. Sans `onRowClick`, les lignes sont inertes.",
      },
    },
  },
};

export const RowClick: Story = {
  name: "Ligne cliquable",
  render: function Render() {
    const [selected, setSelected] = useState<Order | null>(null);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <DataTable columns={ORDER_COLUMNS} rows={ORDERS} rowKey={(o) => o.id} onRowClick={setSelected} />
        <div>
          {selected ? (
            <Badge tone="info">
              {selected.id} · {selected.client} · {euro(selected.montant)}
            </Badge>
          ) : (
            <Badge>Cliquez une ligne</Badge>
          )}
        </div>
      </div>
    );
  },
  parameters: { docs: { description: { story: "`onRowClick` reçoit l'enregistrement entier, pas son index : le tri ne fausse donc pas la sélection." } } },
};

export const NotSortable: Story = {
  name: "Sans tri",
  args: {
    columns: ORDER_COLUMNS.filter((c) => ["id", "client", "montant", "statut"].includes(c.id)).map((column) => ({ ...column, sortValue: undefined })),
    onRowClick: undefined,
  },
  parameters: { docs: { description: { story: "Aucune colonne n'a de `sortValue` : les en-têtes ne réagissent pas au clic, les lignes gardent l'ordre fourni." } } },
};
