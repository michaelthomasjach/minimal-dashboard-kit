import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TreeView, moveTreeNode, Text, FolderIcon, FileIcon, type TreeNode } from "@michaelthomasjach/liseuse-dashboard-kit";

const DOCUMENTS: TreeNode[] = [
  {
    id: "clients",
    label: "Clients",
    icon: <FolderIcon size={16} />,
    children: [
      {
        id: "lemoine",
        label: "Lemoine SAS",
        icon: <FolderIcon size={16} />,
        children: [
          { id: "lemoine-contrat", label: "Contrat-cadre 2026.pdf", icon: <FileIcon size={16} /> },
          { id: "lemoine-factures", label: "Factures T3.zip", icon: <FileIcon size={16} /> },
        ],
      },
      {
        id: "vallee",
        label: "Groupe Vallée",
        icon: <FolderIcon size={16} />,
        children: [{ id: "vallee-devis", label: "Devis D-0193.pdf", icon: <FileIcon size={16} /> }],
      },
    ],
  },
  {
    id: "compta",
    label: "Comptabilité",
    icon: <FolderIcon size={16} />,
    children: [
      { id: "compta-grand-livre", label: "Grand livre 2026.xlsx", icon: <FileIcon size={16} /> },
      { id: "compta-archives", label: "Archives 2024", icon: <FolderIcon size={16} />, disabled: true },
    ],
  },
  { id: "cgv", label: "CGV en vigueur.pdf", icon: <FileIcon size={16} /> },
];

const CATEGORIES: TreeNode[] = [
  {
    id: "logiciels",
    label: "Logiciels",
    children: [
      { id: "abonnements", label: "Abonnements", children: [{ id: "annuels", label: "Annuels" }, { id: "mensuels", label: "Mensuels" }] },
      { id: "licences", label: "Licences poste" },
    ],
  },
  { id: "services", label: "Services", children: [{ id: "formation", label: "Formation" }, { id: "support", label: "Support premium" }] },
];

/** Retrouve un nœud par son identifiant, pour afficher son libellé sous l'arbre. */
function find(nodes: TreeNode[], id: string | null): TreeNode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n;
    const inChild = n.children && find(n.children, id);
    if (inChild) return inChild;
  }
  return undefined;
}

/**
 * L'arborescence : des nœuds qui se déplient, une sélection, et en option le glisser-déposer.
 */
const meta = {
  title: "Primitives/TreeView",
  component: TreeView,
  parameters: {
    docs: {
      description: {
        component: [
          "Arbre récursif à déplier : explorateur de documents, arbre de catégories, organigramme. Chaque nœud (`TreeNode`) a un `id`, un `label`, une `icon` facultative, des `children` facultatifs et peut être `disabled`.",
          "",
          "**Déplier** — le chevron devant un nœud parent le déplie ou le replie ; un clic sur le libellé d'un parent le **sélectionne** et, du même coup, le déplie ou le replie. Non contrôlé par défaut (`defaultExpandedIds`) ; contrôlé avec `expandedIds` et `onExpandedChange(ids)`.",
          "",
          "**Sélection** — un seul nœud à la fois, toujours contrôlée : `selectedId` et `onSelect(id)`. Le nœud choisi prend le fond de survol et passe en gras. Un nœud `disabled` est atténué et n'est pas sélectionnable.",
          "",
          "**Glisser-déposer** — avec `onMove(draggedId, targetId, position)`, les nœuds se déplacent à la souris : déposé sur le haut d'une ligne, avant elle ; sur le bas, après ; au centre, dedans. Un trait d'accent marque l'endroit du dépôt, un pointillé d'accent encadre le nœud qui recevra l'élément. `moveTreeNode(nodes, draggedId, targetId, position)`, exporté par le kit, applique le déplacement sans muter l'arbre. Le déplacement au clavier n'existe pas.",
          "",
          "**Accessibilité** — `role=\"tree\"`, `treeitem` avec `aria-expanded` et `aria-selected`, `group` pour les enfants. Chevron et libellé sont des boutons : Tab passe de l'un à l'autre, Entrée ou Espace agit. Les flèches ne parcourent pas l'arbre.",
          "",
          "**Quand l'utiliser** — une hiérarchie de profondeur variable. Pour des chiffres hiérarchisés par période, `PeriodTable` ; pour un fil d'Ariane, `Breadcrumbs` ; pour deux niveaux fixes, une liste groupée suffit.",
          "",
          "**Thème** — `--lq-color-text`, `--lq-color-text-muted` (chevrons, icônes), `--lq-color-hover` (survol et sélection), `--lq-font-weight-bold` (sélection), `--lq-color-accent` (repères de dépôt), `--lq-radius-sm`, `--lq-radius-pill`, `--lq-transition-fast`.",
        ].join("\n"),
      },
    },
  },
  args: { nodes: DOCUMENTS, defaultExpandedIds: ["clients", "lemoine", "compta"], selectedId: "lemoine-contrat", onSelect: fn(), onExpandedChange: fn() },
  argTypes: {
    nodes: { control: false },
    selectedId: { control: false },
    expandedIds: { control: false },
    // Lu au premier rendu seulement : le changer ensuite ne ferait rien.
    defaultExpandedIds: { control: false },
  },
  render: function Render(args) {
    const [selected, setSelected] = useState<string | null>(args.selectedId ?? null);
    return (
      <div style={{ maxWidth: 320, display: "flex", flexDirection: "column", gap: 10 }}>
        <TreeView
          {...args}
          selectedId={selected}
          onSelect={(id) => {
            setSelected(id);
            args.onSelect?.(id);
          }}
        />
        <Text size="sm" muted>
          Sélection : {find(args.nodes, selected)?.label ?? "aucune"}
        </Text>
      </div>
    );
  },
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Collapsed: Story = {
  name: "Replié",
  args: { defaultExpandedIds: [], selectedId: null },
};

export const WithoutIcons: Story = {
  name: "Sans icônes",
  args: { nodes: CATEGORIES, defaultExpandedIds: ["logiciels", "abonnements"], selectedId: "annuels" },
  parameters: { docs: { description: { story: "Un arbre de catégories : l'indentation et les chevrons suffisent." } } },
};

export const ControlledExpansion: Story = {
  name: "Dépliage contrôlé",
  render: function Render(args) {
    const [expanded, setExpanded] = useState<string[]>(["clients"]);
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: 320, display: "flex", flexDirection: "column", gap: 10 }}>
        <TreeView
          nodes={args.nodes}
          expandedIds={expanded}
          onExpandedChange={setExpanded}
          selectedId={selected}
          onSelect={setSelected}
        />
        <Text size="sm" muted>
          Dépliés : {expanded.length ? expanded.join(", ") : "aucun"}
        </Text>
      </div>
    );
  },
  parameters: { docs: { description: { story: "Avec `expandedIds` et `onExpandedChange`, le parent connaît (et peut imposer) les nœuds dépliés." } } },
};

export const DragAndDrop: Story = {
  name: "Glisser-déposer",
  render: function Render(args) {
    const [nodes, setNodes] = useState<TreeNode[]>(args.nodes);
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: 320, display: "flex", flexDirection: "column", gap: 10 }}>
        <Text size="sm" muted>
          Glissez un document : sur le haut d'une ligne pour le placer avant, sur le bas pour après, au centre pour le ranger dedans.
        </Text>
        <TreeView
          nodes={nodes}
          selectedId={selected}
          onSelect={setSelected}
          defaultExpandedIds={["clients", "lemoine", "vallee", "compta"]}
          onMove={(draggedId, targetId, position) => setNodes((prev) => moveTreeNode(prev, draggedId, targetId, position))}
        />
      </div>
    );
  },
  parameters: { docs: { description: { story: "`onMove` active le glisser-déposer ; `moveTreeNode` calcule le nouvel arbre." } } },
};
