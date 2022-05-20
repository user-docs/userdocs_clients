const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: [
      "./src/background.ts"
    ],
    bundle: true,
    minify: true,
    sourcemap: process.env.NODE_ENV !== "production",
    outdir: "./public/dist",
    define: {
      "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`
    }
  })
  .catch(() => process.exit(1));