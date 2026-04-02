import { defineConfig } from "tsup";
import { cpSync, existsSync } from "fs";
import { join } from "path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
  onSuccess: () => {
    const src = join(process.cwd(), "src", "styles.css");
    const dest = join(process.cwd(), "dist", "styles.css");
    if (existsSync(src)) cpSync(src, dest);
  },
});
