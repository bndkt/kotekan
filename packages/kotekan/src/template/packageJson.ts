import pkg from "../../package.json";

const dependenciesArray = [
	"@physis/react-server-dom-esm",
	"react",
	"react-dom",
	"kotekan",
];

const devDependenciesArray = [
	"@tailwindcss/cli",
	"@types/bun",
	"@types/react",
	"@types/react-dom",
	"tailwindcss",
	"typescript",
];

export const packageJson = async (name: string) => {
	const dependencies: Record<string, string> = {};

	dependenciesArray.sort();
	for (const dep of dependenciesArray) {
		dependencies[dep] =
			dep === "kotekan"
				? pkg.version
				: pkg.dependencies[dep as keyof typeof pkg.dependencies];
	}

	devDependenciesArray.sort();
	const devDependencies: Record<string, string> = {};
	for (const dep of devDependenciesArray) {
		devDependencies[dep] =
			pkg.devDependencies[dep as keyof typeof pkg.devDependencies];
	}

	const packageJson = {
		name: name,
		version: "0.0.1",
		sideEffects: false,
		type: "module",
		module: "index.ts",
		scripts: {
			dev: "kotekan-dev",
			lint: "biome lint ./src",
			start: "kotekan start",
		},
		dependencies,
		devDependencies,
	};

	return packageJson;
};
