import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const workspaceRoot = import.meta.dirname;
const candidateRoots = [
  workspaceRoot,
  path.resolve(workspaceRoot, "ThaFamilyStudio"),
];

const appRoot = candidateRoots.find((root) =>
  fs.existsSync(path.resolve(root, "client", "index.html"))
);

if (!appRoot) {
  throw new Error("Could not find client/index.html for Vite build");
}

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(appRoot, "client", "src"),
      "@shared": path.resolve(appRoot, "shared"),
      "@assets": path.resolve(appRoot, "attached_assets"),
    },
  },
  root: path.resolve(appRoot, "client"),
  build: {
    outDir: path.resolve(appRoot, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
