import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function normalizeAbsoluteBase(value: string): string {
  const withSlash = value.startsWith("/") ? value : `/${value}`;
  return withSlash.endsWith("/") ? withSlash : `${withSlash}/`;
}

/**
 * Base pour le build / preview production.
 * - Par défaut `./` : chemins relatifs → correct sur GitHub Pages quel que soit le nom du dépôt
 *   (évite page blanche si les scripts étaient chargés depuis un mauvais préfixe `/repo/`).
 * - Surcharge : `VITE_BASE=/mon-repo/` (absolu depuis le domaine).
 * - CI : dépôt `*.github.io` → base `/` (site utilisateur à la racine).
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
  }
  return "./";
}

export default defineConfig(({ command, mode }) => ({
  plugins: [react(), tailwindcss()],
  /** Dev : `/`. Build + preview : chemins relatifs (ou VITE_BASE / racine utilisateur). */
  base: command === "serve" && mode === "development" ? "/" : productionBase(),
}));
