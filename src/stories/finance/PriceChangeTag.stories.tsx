import type { Meta, StoryObj } from "@storybook/react-vite";
import { PriceChangeTag } from "@michaelthomasjach/liseuse-dashboard-kit";

/** Le format français d'un pourcentage : virgule décimale, espace avant le signe. */
const pct = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;

/**
 * L'écart signé du kit : flèche, signe et valeur, en vert ou en rouge. C'est lui qu'on retrouve
 * dans `StatCard`, `HoldingCard`, `ComparisonCard` et les widgets de portefeuille.
 */
const meta = {
  title: "Finance/PriceChangeTag",
  component: PriceChangeTag,
  parameters: {
    docs: {
      description: {
        component: [
          "Affiche un **écart signé** — variation d'un cours, résultat, dérive d'une allocation — avec une flèche, le signe et la valeur, colorés selon le sens.",
          "",
          "**Quand l'utiliser** — partout où un chiffre dit « combien ça a bougé ». Pour un statut qui n'est pas un nombre (payée, annulée), prenez `Badge`. Pour un écart sous une grande valeur, `StatCard` l'intègre déjà via `delta`.",
          "",
          "**Comportement** — `value` est signé (`2.4`, `-1.1`). Le composant choisit seul la flèche, la couleur et le signe (`+`, ou le vrai signe moins `−`), puis passe la **valeur absolue** à `format`. Zéro compte comme une hausse : il s'affiche en vert, `+0,00 %`.",
          "",
          "**Format** — sans `format`, le kit écrit `v.toFixed(2) + \" %\"`, soit `2.37 %` avec un **point** décimal. Dans une interface française, passez toujours un `format` (`toLocaleString(\"fr-FR\")`) ; il sert aussi à changer d'unité (points, euros).",
          "",
          "**Thème** — `--lq-color-up` et `--lq-color-down` (vert `#19ad79` et rouge `#d83c31` en clair, éclaircis d'un cran en sombre), `--lq-font-weight-bold`.",
        ].join("\n"),
      },
    },
  },
  args: { value: 2.37, format: pct, showIcon: true },
  argTypes: {
    value: { control: { type: "number", step: 0.1 } },
    format: { control: false, table: { defaultValue: { summary: "(v) => `${v.toFixed(2)} %`" } } },
    showIcon: { table: { defaultValue: { summary: "true" } } },
  },
} satisfies Meta<typeof PriceChangeTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Down: Story = {
  name: "Baisse",
  args: { value: -1.46 },
};

export const Zero: Story = {
  name: "Écart nul",
  args: { value: 0 },
  parameters: { docs: { description: { story: "Un écart nul est rendu comme une hausse — vert, flèche montante, `+0,00 %`." } } },
};

export const OtherUnits: Story = {
  name: "Autres unités",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
      <PriceChangeTag value={35} format={(v) => `${v} pts`} />
      <PriceChangeTag value={-1240} format={(v) => v.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} />
      <PriceChangeTag value={0.8} format={(v) => `${v.toLocaleString("fr-FR")} pt de base`} />
    </div>
  ),
  parameters: { docs: { description: { story: "`format` reçoit la valeur absolue : le signe et la flèche restent l'affaire du composant." } } },
};

export const WithoutIcon: Story = {
  name: "Sans flèche",
  args: { value: -1.2, showIcon: false },
  parameters: { docs: { description: { story: "Pour une colonne dense où la flèche se répète à chaque ligne : la couleur et le signe suffisent." } } },
};

export const KitDefaultFormat: Story = {
  name: "Format par défaut du kit",
  args: { value: 2.37, format: undefined },
  parameters: {
    docs: {
      description: { story: "Sans `format` : `+2.37 %`, avec un point décimal. C'est le rendu qu'on obtient dans les composants qui n'exposent pas le format (voir `HoldingCard`, `ComparisonCard`)." },
    },
  },
};
