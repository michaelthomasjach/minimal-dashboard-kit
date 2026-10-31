import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button, CheckIcon, PlusIcon, ArrowRightIcon } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * Le bouton d'action du kit. Dans le thème « minimal », il prend la mesure des boutons du gabarit
 * Pages : 35 px de haut, texte 14 px en graisse 500, filet d'un pixel, angles de 3 px. Sélectionné,
 * il passe au plein de l'accent.
 */
const meta = {
  title: "Primitives/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component: [
          "Bouton à filet pour une action ou un choix. Avec `selected`, il devient un **bouton bascule** : plein de l'accent, et `selectedIcon` remplace alors `icon` avec une petite animation.",
          "",
          "**Quand l'utiliser** — une action secondaire (Annuler, Exporter), un choix parmi d'autres posés côte à côte, ou l'action principale d'un formulaire en `selected`. Pour une action sans libellé, préférez `IconButton`.",
          "",
          "**Thème** — `--lq-button-padding-y`, `--lq-button-padding-x`, `--lq-button-font-size`, `--lq-control-border-width`, `--lq-radius-md`, `--lq-color-accent`.",
        ].join("\n"),
      },
    },
  },
  args: { children: "Enregistrer", onClick: fn() },
  argTypes: {
    children: { control: "text" },
    icon: { control: false },
    selectedIcon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Selected: Story = {
  name: "Sélectionné",
  args: { selected: true, children: "Valider la facture" },
  parameters: { docs: { description: { story: "L'action principale : plein de l'accent." } } },
};

export const WithIcon: Story = {
  name: "Avec icône",
  args: { icon: <PlusIcon size={16} />, children: "Nouveau client" },
};

export const TrailingIcon: Story = {
  name: "Icône en queue",
  args: { icon: <ArrowRightIcon size={16} />, iconPosition: "trailing", children: "Continuer" },
};

export const Toggle: Story = {
  name: "Bascule",
  args: { selected: true, selectedIcon: <CheckIcon size={16} />, children: "Abonné" },
  parameters: { docs: { description: { story: "En bouton bascule, `selectedIcon` s'affiche tant que `selected` est vrai." } } },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { disabled: true, children: "Exporter" },
};

export const Block: Story = {
  name: "Pleine largeur",
  args: { block: true, selected: true, children: "Fermer" },
};
