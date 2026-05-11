import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/** Nom du dépôt GitHub Pages : https://sebsiders06.github.io/traiteur/ */
const GITHUB_PAGES_REPO = "traiteur";

function normalizeAbsoluteBase(value: string): string {
  const withSlash = value.startsWith("/") ? value : `/${value}`;
  return withSlash.endsWith("/") ? withSlash : `${withSlash}/`;
}

/**
 * Base absolue pour le build / preview production (évite page blanche sans "/" final sur l’URL).
 * Priorité : VITE_BASE → nom issu de GITHUB_REPOSITORY (CI) → dépôt connu ci-dessus.
 * Dépôt utilisateur `*.github.io` : racine `/`.
 */
function productionBase(): string {
  const fromEnv = process.env.VITE_BASE?.trim();
  if (fromEnv) {
    return normalizeAbsoluteBase(fromEnv);
  }
  const ghRepo = process.env.GITHUB_REPOSITORY?.trim();
  if (ghRepo?.includes("/")) {
    const name = ghRepo.split("/")[1];
    if (name.endsWith(".github.io")) {
      return "/";
    }
    return `/${name}/`;
  }
  return `/${GITHUB_PAGES_REPO}/`;
}

export default defineConfig(({ command, mode }) => ({
  plugins: [react(), tailwindcss()],
  base: command === "serve" && mode === "development" ? "/" : productionBase(),
}));
