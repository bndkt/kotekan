const build = await Bun.build({
	entrypoints: [
		"./src/cli/dev.ts",
		"./src/cli/cli.ts",
		"./src/cli/scripts/jsxPreload.ts",
		"./src/cli/scripts/jsxServer.ts",
		"./src/cli/scripts/ssrPreload.ts",
		"./src/cli/scripts/ssrServer.ts",
	],
	outdir: "./build",
	target: "bun",
	external: ["estree-util-build-jsx"],
});

console.log(build.success, build.logs);
