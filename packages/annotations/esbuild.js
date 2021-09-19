const esbuild = require('esbuild')

// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require('esbuild-node-externals')

esbuild.build({
  entryPoints: ['./lib/browser.ts'],
  outfile: 'dist/bundle.js',
  //minify: true,
  bundle: true
}).catch(() => process.exit(1))