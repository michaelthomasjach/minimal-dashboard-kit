import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { RangeSlider } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS } from "../../showcase/demoData";

const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const signe = (n: number) => `${n > 0 ? "+" : ""}${n} %`;

/** Les montants de commande de la démo bornent le curseur « Montant » : le filtre couvre les vraies données. */
const MONTANT_MAX = Math.ceil(Math.max(...ORDERS.map((o) => o.montant)) / 1000) * 1000;

/**
 * Un intervalle de valeurs à deux poignées.
 */
const meta = {
  title: "Forms/RangeSlider",
  component: RangeSlider,
  parameters: {
    docs: {
      description: {
        component: [
          "Curseur à **deux poignées** qui délimite un intervalle `[bas, haut]` sur une piste. Les deux bornes s'affichent au-dessus de la piste, mises en forme par `formatValue` (devise, pourcentage, unité). On tire une poignée pour étirer l'intervalle, ou la **bande** pleine entre elles pour le déplacer d'un bloc en gardant sa largeur.",
          "",
          "**Quand l'utiliser** — filtrer une liste sur une plage numérique dont l'ordre de grandeur compte plus que la valeur exacte : un montant, une variation, une ancienneté. Pour des bornes à saisir précisément, deux `InputNumber` ; pour une période calendaire, `DateRangePicker`.",
          "",
          "**Valeur** — composant **contrôlé** : `value` est un couple `[bas, haut]`, `onChange` reçoit le nouveau couple **à chaque mouvement** — pendant un glisser, plusieurs dizaines de fois par seconde. Pour interroger un serveur, temporisez côté appelant. Les valeurs sont arrondies au `step` (1 par défaut) et une poignée ne franchit jamais l'autre.",
          "",
          "**Centré sur zéro** — avec `centerZero` (et `min < 0 < max`), un repère marque le zéro et la bande se colore en rouge à gauche, en vert à droite : pour une variation, un écart. La bande n'est alors plus saisissable d'un bloc — seules les poignées bougent.",
          "",
          "**Clavier** — chaque poignée est focalisable (`role=\"slider\"`, libellée d'après `label` : « Montant de commande — minimum » / « — maximum ») ; ← / ↓ et → / ↑ la déplacent d'un `step`. Pas de Début / Fin ni de pas large, et un clic sur la piste hors de la bande ne déplace rien.",
          "",
          "**Thème** — piste `--lq-color-fill-track`, bande `--lq-color-fill` (ou `--lq-color-down` / `--lq-color-up` centrée sur zéro), poignées rondes (`--lq-radius-pill`) bordées de `--lq-color-border` sur `--lq-color-bg`, anneau `--lq-color-focus-ring`, bornes en `--lq-color-text-muted`.",
        ].join("\n"),
      },
    },
  },
  args: {
    label: "Montant de commande",
    min: 0,
    max: MONTANT_MAX,
    step: 500,
    value: [1000, 15000],
    formatValue: euro,
    onChange: fn(),
  },
  argTypes: {
    value: { control: false },
    onChange: { control: false },
    formatValue: { control: false },
  },
  render: function Render(args) {
    const [value, setValue] = useState<[number, number]>(args.value);
    return (
      <div style={{ maxWidth: 420 }}>
        <RangeSlider
          {...args}
          value={value}
          onChange={(v) => {
            setValue(v);
            args.onChange(v);
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof RangeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Pas de 500 € ; tirez la bande pour déplacer l'intervalle sans changer sa largeur." } } },
};

export const CenterZero: Story = {
  name: "Centré sur zéro",
  args: { label: "Variation sur 30 jours", min: -50, max: 50, step: 1, value: [-15, 25], formatValue: signe, centerZero: true },
  parameters: { docs: { description: { story: "Rouge sous zéro, vert au-dessus, et un repère sur le zéro. Seules les poignées bougent." } } },
};

export const Years: Story = {
  name: "Ancienneté",
  args: { label: "Ancienneté du client (ans)", min: 0, max: 20, step: 1, value: [2, 8], formatValue: (n: number) => `${n} an${n > 1 ? "s" : ""}` },
};

export const Narrow: Story = {
  name: "Intervalle étroit",
  args: { label: "Remise accordée", min: 0, max: 30, step: 0.5, value: [10, 12.5], formatValue: (n: number) => `${n.toLocaleString("fr-FR")} %` },
  parameters: { docs: { description: { story: "Un pas décimal ; les deux poignées presque collées restent saisissables chacune." } } },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { label: "Plage de prix imposée", disabled: true },
};
