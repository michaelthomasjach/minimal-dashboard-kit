import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Card, PanelRow, Button, Text, Sparkline, ArrowRightIcon } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS, REVENUE_TREND } from "../../showcase/demoData";

const euros = (n: number) => `${n.toLocaleString("fr-FR")} €`;
const RENEWALS = ORDERS.filter((o) => o.produit === "Abonnement annuel");

/**
 * La carte de section : la boîte du thème (filet, angles de 2 px, ombre légère), un en-tête plus
 * marqué que celui de `Panel`, et des marges plus généreuses.
 */
const meta = {
  title: "Primitives/Card",
  component: Card,
  parameters: {
    docs: {
      description: {
        component: [
          "La carte du kit : en-tête (`title` à gauche, `meta` atténuée à côté), un `summary` facultatif toujours visible, le corps, et un `footer` sous un filet.",
          "",
          "**Card ou Panel ?** — même coquille (filet, rayon, ombre), deux usages. `Panel` groupe des lignes sous un petit intitulé en capitales, serré, pour les écrans denses. `Card` met en avant **une** section : titre plus présent, marges de 20 px, résumé. Dans ce thème, le titre de carte suit les petites capitales du gabarit (`--lq-caption-*`).",
          "",
          "**Trois formes, un composant** —",
          "- par défaut, une carte toujours ouverte ;",
          "- `expandable` : le corps se replie derrière l'en-tête, qui devient le bouton (chevron) — c'est `ExpandableCard` ;",
          "- `highlight` : une tuile d'indicateur sans boîte, avec un filet épais en haut — c'est `Highlight`.",
          "",
          "**Repli** — avec `expandable`, non contrôlé par défaut (`defaultOpen`) ; contrôlé avec `open` et `onOpenChange`. Donnez un `title` : sans en-tête, rien ne permet d'ouvrir la carte.",
          "",
          "**Sans cadre** — `bare` retire filet, fond et ombre, pour une carte posée dans une cellule déjà encadrée.",
          "",
          "**Thème** — `--lq-color-panel`, `--lq-color-panel-border`, `--lq-color-border-subtle` (filets internes), `--lq-radius-lg`, `--lq-shadow-panel`, `--lq-space-2` à `--lq-space-5` ; le titre `--lq-caption-font`, `--lq-caption-size`, `--lq-caption-weight`, `--lq-caption-tracking`, `--lq-caption-transform` ; l'en-tête cliquable `--lq-color-hover`.",
        ].join("\n"),
      },
    },
  },
  args: {
    title: "Abonnements à renouveler",
    meta: "novembre",
    summary: `${RENEWALS.length} contrats arrivent à échéance dans les 30 jours.`,
    children: (
      <>
        {RENEWALS.map((o) => (
          <PanelRow key={o.id} label={o.client} value={euros(o.montant)} />
        ))}
      </>
    ),
    footer: (
      <Button icon={<ArrowRightIcon size={16} />} iconPosition="trailing">
        Ouvrir la liste
      </Button>
    ),
    onOpenChange: fn(),
  },
  argTypes: {
    title: { control: "text" },
    meta: { control: "text" },
    summary: { control: "text" },
    children: { control: false },
    footer: { control: false },
    open: { control: false },
    // Lu au premier rendu seulement : le changer ensuite ne ferait rien.
    defaultOpen: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 440 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Simple: Story = {
  name: "Titre et corps",
  args: {
    title: "Encours clients",
    meta: undefined,
    summary: undefined,
    footer: undefined,
    children: (
      <>
        <PanelRow label="Échu" value="12 480 €" />
        <PanelRow label="À échoir sous 30 j" value="54 200 €" />
      </>
    ),
  },
};

export const WithoutHeader: Story = {
  name: "Sans en-tête",
  args: {
    title: undefined,
    meta: undefined,
    summary: undefined,
    footer: undefined,
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Text size="sm" muted>
          Revenu mensuel
        </Text>
        <Text size="xl" weight="bold">
          80 000 €
        </Text>
        <Sparkline data={REVENUE_TREND} width={360} height={40} area />
      </div>
    ),
  },
  parameters: { docs: { description: { story: "Sans `title`, la carte n'est plus qu'une boîte : le corps prend toute la place." } } },
};

export const Expandable: Story = {
  name: "Repliable",
  args: { expandable: true, defaultOpen: false },
  parameters: { docs: { description: { story: "`expandable` : replié, seul le corps disparaît — l'en-tête, le résumé et le pied restent. Cliquez l'en-tête pour déplier." } } },
};

export const Bare: Story = {
  name: "Sans cadre",
  args: { bare: true, title: "Carte sans cadre", meta: undefined, summary: undefined, footer: undefined, children: <Text size="sm" muted>Ni filet, ni fond, ni ombre : la carte se fond dans la cellule qui l'accueille.</Text> },
  decorators: [
    (Story) => (
      <div style={{ border: "1px dashed var(--lq-color-border)" }}>
        <Story />
      </div>
    ),
  ],
};
