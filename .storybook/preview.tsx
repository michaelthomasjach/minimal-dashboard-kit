import type { Preview } from "@storybook/react-vite";
import * as Kit from "@michaelthomasjach/liseuse-dashboard-kit";
import { MinimalTheme } from "../src/theme";
import docgen from "../src/stories/docgen.json";

/**
 * Rattache à chaque composant exporté par le kit la documentation extraite de ses types (voir
 * scripts/docgen.mjs) : c'est ce que lit l'onglet Docs pour la description et la table des props.
 * Elle remplace celle que react-docgen tire du source du kit ; les composants que le kit n'exporte
 * pas (pages du kit incluses telles quelles, voir main.ts) gardent cette dernière.
 */
for (const [name, info] of Object.entries(docgen.components)) {
  const component = (Kit as Record<string, unknown>)[name];
  if (component && (typeof component === "function" || typeof component === "object")) {
    (component as { __docgenInfo?: unknown }).__docgenInfo = { displayName: name, ...info };
  }
}

const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    surface: {
      description: "Surface du thème",
      toolbar: {
        title: "Surface",
        icon: "mirror",
        items: [
          { value: "light", title: "Claire", icon: "sun" },
          { value: "dark", title: "Sombre", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { surface: "light" },
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true, sort: "requiredFirst" },
    docs: { source: { type: "dynamic", language: "tsx" }, toc: true },
    options: {
      // Le même ordre que le Storybook du kit (../Dashboard liseuse/.storybook/preview.tsx) : la
      // page d'accueil, puis des plus petites briques aux plus grands assemblages. Ce qui n'est pas
      // listé (Audio, Scheduler) garde sa place alphabétique après.
      storySort: {
        order: [
          "Accueil",
          "Foundations",
          "Primitives",
          "Forms",
          "Feedback",
          "Charts",
          "Map",
          "Finance",
          "Finance Widgets",
          "Widgets",
          "Dashboard",
          "Layouts",
          "Pages",
        ],
      },
    },
  },
  decorators: [
    // Le fond du thème couvre toute la zone d'affichage (sinon il s'arrête au contenu et laisse du
    // blanc dessous, criant en surface sombre). Les composants pleine page — mises en page, pages,
    // notifications fixes — déclarent `mdkPadding: 0` pour ne pas recevoir la marge de 30 px.
    (Story, context) => (
      <MinimalTheme surface={context.globals.surface === "dark" ? "dark" : "light"}>
        <div
          style={{
            padding: context.parameters.mdkPadding ?? (context.viewMode === "story" ? 30 : 20),
            minHeight: context.viewMode === "story" ? "100vh" : undefined,
            boxSizing: "border-box",
            background: "var(--lq-color-bg)",
          }}
        >
          <Story />
        </div>
      </MinimalTheme>
    ),
  ],
};

export default preview;
