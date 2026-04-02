import * as esbuild from "esbuild"

await esbuild.build({
   entryPoints: ["src/index.ts"],
   bundle: false,
   outfile: "dist/index.js",
   format: "esm",
   platform: "neutral",
   target: "es2016",
   minify: false,
})
