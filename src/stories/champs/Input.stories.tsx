import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, SearchIcon, UserIcon } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * Le champ texte de base. Tous les champs du kit (Select, MaskedInput, DatePicker…) en partagent
 * l'apparence : filet, hauteur, état d'erreur.
 */
const meta = {
  title: "Forms/Input/Input",
  component: Input,
  parameters: {
    docs: {
      description: {
        component: [
          "Champ de saisie avec libellé, icônes de tête et de queue, texte d'aide et état d'erreur. Il transmet tous les attributs d'un `<input>` (`value`, `onChange`, `type`, `required`…).",
          "",
          "**Deux dispositions** — `labelPosition=\"above\"` (défaut) pose le libellé au-dessus, comme le champ « traditionnel » du gabarit ; `labelPosition=\"inside\"` le pose **dans la boîte** : il rétrécit dès que le champ prend le focus ou une valeur, et `required` ajoute un astérisque dans le coin.",
          "",
          "**Thème** — `--lq-control-height` (32 px), `--lq-control-padding-x`, `--lq-control-font-size`, `--lq-control-color`, `--lq-field-label-size`, `--lq-field-label-weight`, `--lq-field-gap`, `--lq-field-helper-offset`.",
        ].join("\n"),
      },
    },
  },
  args: { label: "Raison sociale", placeholder: "Lemoine SAS" },
  argTypes: { leadingIcon: { control: false }, trailingIcon: { control: false } },
  // Un champ contrôlé : la story tient sa valeur, et les contrôles règlent tout le reste.
  render: function Render(args) {
    const [value, setValue] = useState("");
    return (
      <div style={{ maxWidth: 420 }}>
        <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
    );
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const WithHelper: Story = {
  name: "Avec aide",
  args: { label: "Courriel de facturation", placeholder: "compta@exemple.fr", helperText: "Sert uniquement à l'envoi des factures." },
};

export const WithError: Story = {
  name: "En erreur",
  args: { label: "SIRET", error: "Le SIRET compte 14 chiffres." },
};

export const WithIcon: Story = {
  name: "Avec icône",
  args: { label: "Client", leadingIcon: <UserIcon size={16} /> },
};

export const Small: Story = {
  name: "Petit",
  args: { label: "Recherche rapide", size: "small", leadingIcon: <SearchIcon size={14} />, placeholder: "Filtrer…" },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { label: "Identifiant interne", disabled: true, placeholder: "CLI-00418" },
};

export const LabelInside: Story = {
  name: "Libellé intégré",
  args: { label: "Projet", labelPosition: "inside", required: true, placeholder: undefined },
  parameters: { docs: { description: { story: "Cliquez dans le champ : le libellé rétrécit, le filet prend l'accent. Il reste petit une fois le champ rempli." } } },
};

export const InsideForm: Story = {
  name: "Formulaire à libellés intégrés",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 520 }}>
      <Input labelPosition="inside" label="Projet" required />
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Input labelPosition="inside" label="Prénom" required />
        </div>
        <div style={{ flex: 1 }}>
          <Input labelPosition="inside" label="Nom" />
        </div>
      </div>
      <Input labelPosition="inside" label="Courriel" placeholder="ex. : nom@exemple.fr" required />
      <Input labelPosition="inside" label="Désactivé" placeholder="Rien à saisir ici" disabled />
    </div>
  ),
};
