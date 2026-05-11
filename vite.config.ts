import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Base URL pour GitHub Pages (https://USER.github.io/REPO/).
 * - En local (`vite dev`) : "/"
 * - En build : priorité à VITE_BASE (ex. "/mon-depot/"), sinon GITHUB_REPOSITORY (CI), sinon le nom par défaut ci-dessous.
 */
const DEFAULT_REPO = "traiteur";

function productionBase(): string {
  const fromEnv = process.env.VITE_BASE?.trim();
  if (fromEnv) {
    const withSlash = fromEnv.startsWith("/") ? fromEnv : `/${fromEnv}`;
    return withSlash.endsWith("/") ? withSlash : `${withSlash}/`;
  }
  const ghRepo = process.env.GITHUB_REPOSITORY?.trim();
  if (ghRepo?.includes("/")) {
    const name = ghRepo.split("/")[1];
    /** Dépôt utilisateur / org : https://USER.github.io/ → assets à la racine */
    if (name.endsWith(".github.io")) {
      return "/";
    }
    return `/${name}/`;
  }
  return `/${DEFAULT_REPO}/`;
}

export default defineConfig(({ command, mode }) => ({
  plugins: [react(), tailwindcss()],
  /** Dev seulement : `/`. Build + preview prod : base GitHub Pages. */
  base: command === "serve" && mode === "development" ? "/" : productionBase(),
}));
