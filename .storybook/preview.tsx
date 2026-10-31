import type { Preview } from "@storybook/react-vite";
import * as Kit from "@michaelthomasjach/liseuse-dashboard-kit";
import { MinimalTheme } from "../src/theme";
import docgen from "../src/stories/docgen.json";

/**
 * Rattache à chaque composant du kit la documentation extraite de ses déclarations (voir
 * scripts/docgen.mjs) : c'est ce que lit l'onglet Docs pour la description et la table des props.
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
      storySort: { order: ["Introduction", "Thème", "Composants", "Écrans"] },
    },
  },
  decorators: [
    (Story, context) => (
      <MinimalTheme surface={context.globals.surface === "dark" ? "dark" : "light"}>
        <div style={{ padding: context.parameters.layout === "fullscreen" && context.viewMode === "story" ? 30 : 20 }}>
          <Story />
        </div>
      </MinimalTheme>
    ),
  ],
};

export default preview;
