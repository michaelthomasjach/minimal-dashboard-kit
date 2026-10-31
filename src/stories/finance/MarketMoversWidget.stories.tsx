import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
import { MarketMoversWidget } from "@michaelthomasjach/liseuse-dashboard-kit";
import { GAINERS, LOSERS } from "../../showcase/demoData";

/**
 * Les plus fortes variations de la séance, en deux onglets : hausses et baisses.
 */
const meta = {
  title: "Composants/Finance/MarketMoversWidget",
  component: MarketMoversWidget,
  parameters: {
    docs: {
      description: {
        component: [
          "Widget **prêt à poser** : une carte titrée qui liste les plus fortes **hausses** et **baisses** de la séance, une liste par onglet.",
          "",
          "**Quand l'utiliser** — une colonne de tableau de bord de marché, pour voir d'un coup d'œil ce qui bouge. Pour suivre des valeurs choisies (cours, quantité, courbe), prenez `WatchlistWidget` ; pour un classement complet et triable, `DataTable`.",
          "",
          "**Anatomie** — une `Panel` avec `title` (« Marché » par défaut), des `Tabs` « Hausses » / « Baisses », puis une `PanelRow` par valeur : « `symbol` · `name` » à gauche, l'écart `change` en `PriceChangeTag` à droite. Chaque élément de `gainers` et `losers` a la forme `{ id, symbol, name, change }`.",
          "",
          "**Comportement** — l'onglet actif est interne au widget (il s'ouvre sur « Hausses ») ; les onglets sont de vrais `role=\"tab\"`. L'**ordre** des listes est celui que vous fournissez : le widget ne trie pas. Une liste vide affiche « Aucune donnée ».",
          "",
          "**Limites** — les libellés d'onglets et le message vide sont fixes, les lignes ne sont pas cliquables (pas de `onSelect`), et l'écart sort au format du kit (`+6.42 %`, point décimal).",
          "",
          "**Thème** — `Panel` (`--lq-color-panel`, `--lq-shadow-panel`), `Tabs` (`--lq-caption-*` : onglets en petites capitales, `--lq-color-accent` pour l'onglet actif), `PanelRow` (`--lq-row-font-size`), `--lq-color-up` / `--lq-color-down`.",
        ].join("\n"),
      },
    },
  },
  args: { title: "Variations du jour", gainers: GAINERS, losers: LOSERS },
  argTypes: {
    title: { control: "text", table: { defaultValue: { summary: '"Marché"' } } },
    gainers: { control: "object" },
    losers: { control: "object" },
  },
  render: (args) => (
    <div style={{ maxWidth: 380 }}>
      <MarketMoversWidget {...args} />
    </div>
  ),
} satisfies Meta<typeof MarketMoversWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const LosersTab: Story = {
  name: "Onglet des baisses",
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("tab", { name: "Baisses" }));
  },
  parameters: { docs: { description: { story: "Après un clic sur « Baisses ». Les valeurs gardent l'ordre fourni : à vous de les classer de la plus forte à la plus faible." } } },
};

export const NoLosers: Story = {
  name: "Séance sans baisse",
  args: { losers: [] },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("tab", { name: "Baisses" }));
  },
  parameters: { docs: { description: { story: "Une liste vide affiche « Aucune donnée » — un texte fixe du kit." } } },
};
