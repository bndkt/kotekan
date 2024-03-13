export const packageJson = (name: string) => {
	const packageJson = {
		name: name,
		version: "0.0.1",
		module: "index.ts",
		type: "module",
		sideEffects: false,
		scripts: {
			lint: "biome lint ./src",
			dev: "kotekan dev",
			start: "kotekan start",
		},
		dependencies: {
			kotekan: "latest",
			react: "0.0.0-experimental-56e20051c-20240311",
			"react-dom": "0.0.0-experimental-56e20051c-20240311",
		},
		devDependencies: {
			"@tailwindcss/cli": "4.0.0-alpha.8",
			"@types/bun": "1.0.8",
			"@types/react": "18.2.65",
			"@types/react-dom": "18.2.21",
			tailwindcss: "4.0.0-alpha.8",
			typescript: "5.4.2",
		},
	};

	return packageJson;
};
