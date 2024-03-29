import path from "node:path";

const outdir = path.join(import.meta.dir, "..", "vendor");
const rsdeDir = path.join(
	import.meta.dir,
	"..",
	"..",
	"..",
	"react-server-dom-esm",
);

// Browser Dev
await Bun.build({
	entrypoints: [
		path.join(
			rsdeDir,
			"esm",
			"react-server-dom-esm-client.browser.development.js",
		),
	],
	minify: false,
	outdir,
	target: "browser",
});

// Browser Prod
await Bun.build({
	entrypoints: [
		path.join(
			rsdeDir,
			"esm",
			"react-server-dom-esm-client.browser.production.min.js",
		),
	],
	minify: true,
	outdir,
	target: "browser",
});
