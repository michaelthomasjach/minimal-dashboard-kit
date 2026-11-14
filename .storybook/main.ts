import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

/**
 * Le Storybook de la couche « minimal » : **les stories du kit elles-mêmes**, rendues dans ce thème.
 *
 * Les deux bibliothèques ont les mêmes composants et les mêmes fonctionnalités ; seul le dessin
 * change. Le menu est donc celui du Storybook du kit (`../Dashboard liseuse`), story pour story :
 * ses fichiers `*.stories.tsx` sont chargés tels quels depuis son code source (`KIT_STORIES`), et le
 * décorateur de preview.tsx les enveloppe toutes dans `MinimalTheme`. Rien n'est recopié : une story
 * ajoutée au kit apparaît ici au prochain lancement, et la publication (deploy-pages.yml) clone le
 * kit à jour à côté avant de construire.
 *
 * Deux entrées seulement viennent de ce dépôt (`OWN_STORIES`) : l'« Accueil », qui présente la
 * couche à la place de la page d'accueil du kit (même titre, même identifiant, même place), et la
 * page des variables du thème, la seule chose que ce Storybook a à montrer en plus.
 *
 * Pour que ces stories et le thème parlent du même composant, le paquet tout entier est ici
 * remplacé par le code source du kit (voir `viteFinal`). La vitrine (`npm run dev`, vite.config.ts)
 * continue, elle, d'utiliser le paquet publié.
 */
const KIT = fileURLToPath(new URL("../../Dashboard liseuse/", import.meta.url));

/** Ce que ce dépôt ajoute au menu du kit. */
const OWN_STORIES = ["../src/stories/accueil/Accueil.stories.tsx", "../src/stories/Theme.mdx"];

/**
 * Toutes les stories du kit, sauf sa page d'accueil (`src/landing/`) : elle porte le titre
 * « Accueil » de la nôtre, et deux stories ne peuvent pas avoir le même identifiant. Le même motif
 * que dans le kit (`../src/**`), pour que les fichiers soient trouvés — et donc rangés — dans le même
 * ordre que dans son menu.
 */
const KIT_STORIES = ["../../Dashboard liseuse/src/!(landing)/**/*.stories.@(ts|tsx)"];

const config: StorybookConfig = {
  stories: [...OWN_STORIES, ...KIT_STORIES],
  addons: ["@storybook/addon-docs"],
  framework: { name: "@storybook/react-vite", options: {} },
  typescript: { reactDocgen: "react-docgen" },
  viteFinal: async (viteConfig) => {
    const alias = viteConfig.resolve?.alias;
    const existing = Array.isArray(alias)
      ? alias
      : Object.entries(alias ?? {}).map(([find, replacement]) => ({ find, replacement: replacement as string }));
    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: [
        // La feuille compilée du paquet n'a plus lieu d'être : le source du kit importe ses CSS
        // lui-même, composant par composant. Un fichier vide prend sa place.
        {
          find: /^@michaelthomasjach\/liseuse-dashboard-kit\/style\.css$/,
          replacement: fileURLToPath(new URL("./kit-style-empty.css", import.meta.url)),
        },
        { find: /^@michaelthomasjach\/liseuse-dashboard-kit$/, replacement: `${KIT}src/index.ts` },
        ...existing,
      ],
      // Le source du kit résoudrait sinon `react` dans ses propres node_modules : deux React dans la
      // page, et chaque hook casse. Même chose pour `storybook/test` (les `fn()` de ses stories) :
      // une seule copie de Storybook dans la page, celle de ce dépôt.
      dedupe: [...(viteConfig.resolve?.dedupe ?? []), "react", "react-dom", "storybook", "@storybook/react"],
    };
    viteConfig.server = {
      ...viteConfig.server,
      // Le dossier du kit est hors de la racine de ce dépôt : Vite refuse de servir ses fichiers
      // sans cette autorisation.
      fs: { ...viteConfig.server?.fs, allow: [...(viteConfig.server?.fs?.allow ?? []), fileURLToPath(new URL("..", import.meta.url)), KIT] },
      // Le dépôt vit dans un dossier OneDrive : la surveillance native des fichiers y casse parfois
      // le serveur sans un mot. Le sondage est la parade connue, la même que dans le dépôt du kit.
      watch: { ...viteConfig.server?.watch, usePolling: true, interval: 300 },
    };
    return viteConfig;
  },
};

export default config;
