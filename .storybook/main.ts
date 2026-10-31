import type { StorybookConfig } from "@storybook/react-vite";

/**
 * Le Storybook de la couche « minimal » : chaque composant du kit, rendu dans ce thème, avec son
 * code, sa documentation et la table de ses props.
 *
 * L'extraction automatique des props est coupée (`reactDocgen: false`) : elle ne lit que les
 * sources du projet, et les composants viennent ici d'un paquet compilé. Leur documentation est
 * extraite du fichier de déclarations du paquet par `npm run docgen` (scripts/docgen.mjs) et
 * rattachée à chaque composant dans preview.tsx.
 */
const config: StorybookConfig = {
  stories: ["../src/stories/**/*.mdx", "../src/stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: { name: "@storybook/react-vite", options: {} },
  typescript: { reactDocgen: false },
  // Le dépôt vit dans un dossier OneDrive : la surveillance native des fichiers y casse parfois le
  // serveur sans un mot. Le sondage est la parade connue, la même que dans le dépôt du kit.
  viteFinal: async (viteConfig) => {
    viteConfig.server = {
      ...viteConfig.server,
      watch: { ...viteConfig.server?.watch, usePolling: true, interval: 300 },
    };
    return viteConfig;
  },
};

export default config;
