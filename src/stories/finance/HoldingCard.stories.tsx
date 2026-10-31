import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { HoldingCard, Badge } from "@michaelthomasjach/liseuse-dashboard-kit";
import { HOLDINGS } from "../../showcase/demoData";

const price = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });

const [LVMH, AIRBUS] = HOLDINGS;

/**
 * Une position sur une ligne : le titre, son cours, son écart de la séance. La brique des listes de
 * surveillance (`WatchlistWidget` n'est qu'une pile de `HoldingCard`).
 */
const meta = {
  title: "Finance/HoldingCard",
  component: HoldingCard,
  parameters: {
    docs: {
      description: {
        component: [
          "Carte-ligne compacte pour **une position** : une pastille à la lettre du symbole, le symbole et le nom de la société, une petite courbe, le cours et l'écart, et au choix la quantité détenue.",
          "",
          "**Quand l'utiliser** — une liste courte de titres, empilée verticalement (portefeuille, valeurs suivies). Sous un titre et dans une carte, préférez directement `WatchlistWidget`. Pour comparer beaucoup de positions colonne par colonne (tri, quantités, valorisation), prenez `DataTable`.",
          "",
          "**Anatomie** — `Avatar` de `symbol` (sa première lettre : un symbole est un seul mot), `symbol` et `name`, `sparklineData` (au moins deux points, 64 × 28 px, verte ou rouge selon sa pente), `price` passé à `formatPrice`, `change` (pourcentage signé) rendu par un `PriceChangeTag`, et `quantity` suivi du mot « parts ».",
          "",
          "**Formats** — `formatPrice` reçoit le cours brut ; sans lui, le kit écrit `642.30 €` avec un point. L'écart `change`, lui, n'a **pas** de format réglable : il sort toujours en `+1.84 %`. Le mot « parts » est fixe. Empilées, les cartes n'alignent pas leurs colonnes : la largeur de « 120 parts » décale le cours et la courbe d'une ligne à l'autre.",
          "",
          "**Comportement** — sans `onClick`, la carte est inerte. Avec `onClick`, elle reçoit `role=\"button\"`, devient focalisable (Tab) et prend un fond au survol ; mais **Entrée et Espace ne la déclenchent pas** — seul le clic souris le fait.",
          "",
          "**Thème** — `--lq-color-panel`, `--lq-color-border-subtle`, `--lq-radius-lg`, `--lq-color-hover` (survol), `--lq-color-up` / `--lq-color-down`, `--lq-space-2`, `--lq-space-3`.",
        ].join("\n"),
      },
    },
  },
  args: {
    symbol: LVMH.symbol,
    name: LVMH.name,
    quantity: LVMH.quantity,
    price: LVMH.price,
    change: LVMH.change,
    sparklineData: LVMH.sparklineData,
    formatPrice: price,
    onClick: fn(),
  },
  argTypes: {
    price: { control: { type: "number", step: 0.01 } },
    change: { control: { type: "number", step: 0.01 } },
    formatPrice: { control: false, table: { defaultValue: { summary: "(v) => `${v.toFixed(2)} €`" } } },
  },
  render: (args) => (
    <div style={{ maxWidth: 460 }}>
      <HoldingCard {...args} />
    </div>
  ),
} satisfies Meta<typeof HoldingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Down: Story = {
  name: "En baisse",
  args: {
    symbol: AIRBUS.symbol,
    name: AIRBUS.name,
    quantity: AIRBUS.quantity,
    price: AIRBUS.price,
    change: AIRBUS.change,
    sparklineData: AIRBUS.sparklineData,
  },
};

export const Static: Story = {
  name: "Non cliquable, sans quantité",
  args: { symbol: "OR", name: "L'Oréal", price: 371.9, change: 0.12, quantity: undefined, sparklineData: undefined, onClick: undefined },
  parameters: { docs: { description: { story: "Sans `onClick`, ni survol ni curseur : une simple ligne d'information." } } },
};

export const List: Story = {
  name: "Liste de positions",
  render: function Render() {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 460 }}>
        {HOLDINGS.map(({ id, ...holding }) => (
          <HoldingCard key={id} {...holding} formatPrice={price} onClick={() => setSelected(id)} />
        ))}
        <div>{selected ? <Badge tone="info">Position ouverte : {HOLDINGS.find((h) => h.id === selected)?.name}</Badge> : <Badge>Cliquez une ligne</Badge>}</div>
      </div>
    );
  },
  parameters: { docs: { description: { story: "Les cartes s'empilent ; un clic ouvre le détail de la position (ici, la pastille du bas)." } } },
};
