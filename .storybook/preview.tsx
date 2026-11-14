import type { Preview } from "@storybook/react-vite";
import { MinimalTheme } from "../src/theme";
// Les pastilles « Primitives utilisées » des pages Docs du kit : le même composant que dans son
// Storybook, pour que les deux pages Docs d'un même composant soient les mêmes.
import { PrimitiveLinks } from "../../Dashboard liseuse/.storybook/PrimitiveLinks";

/**
 * La preview du kit (`../Dashboard liseuse/.storybook/preview.tsx`), à une différence près : le
 * décorateur pose `MinimalTheme` là où le kit pose `LqThemeProvider`. Les stories étant celles du
 * kit (voir main.ts), tout le reste — marges, tri du menu, réglages des contrôles — en est recopié
 * pour qu'une story s'affiche ici exactement comme là-bas, au dessin près.
 *
 * Seule la surface est réglable dans la barre d'outils : la palette (e-ink ou couleur) et la police
 * du kit sont justement ce que ce thème remplace (voir src/theme/index.tsx).
 */
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
    options: {
      // Le même ordre que le kit, écrit en dur parce que Storybook lit `storySort` sans exécuter ce
      // fichier (un import n'y serait pas résolu). Sous chaque famille, l'ordre est celui où les
      // fichiers sont trouvés — le même motif de recherche que le kit, donc le même menu.
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
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
  },
  decorators: [
    (Story, context) => {
      // Comme dans le kit : 32 px autour de chaque story (les stories plein écran les annulent par
      // `margin: -32`), et la hauteur d'écran remplie sauf sur une page Docs, où chaque bloc prend
      // celle de son contenu. L'accueil de ce dépôt, qui porte ses propres marges, déclare
      // `mdkPadding: 0`.
      const fillsViewport = context.viewMode !== "docs";
      return (
        <MinimalTheme surface={context.globals.surface === "dark" ? "dark" : "light"}>
          <div
            style={{
              minHeight: fillsViewport ? "100vh" : undefined,
              padding: context.parameters.mdkPadding ?? "32px",
              backgroundColor: "var(--lq-color-bg)",
            }}
          >
            <PrimitiveLinks title={context.title} viewMode={context.viewMode} />
            <Story />
          </div>
        </MinimalTheme>
      );
    },
  ],
};

export default preview;
