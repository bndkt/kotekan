import path from "node:path";
import { resolveSync, type BunPlugin } from "bun";
import { parse } from "es-module-lexer"; // @todo

import type {
	ClientComponentsMap,
	ClientEntryPoints,
} from "../../server/builder";

interface PluginConfig {
	clientEntryPoints: ClientEntryPoints;
	clientComponentsMap: ClientComponentsMap;
	development?: boolean;
}

const PLUGIN_FILTER = /\.(jsx|js|tsx|ts|mjs|cjs|mts|cts)$/;

const transpiler = new Bun.Transpiler({
	loader: "tsx",
});

export const rscPlugin: (config: PluginConfig) => BunPlugin = (config) => {
	return {
		name: "rscPlugin",
		setup(build) {
			// console.log(builder.config, config);

			build.onResolve({ filter: PLUGIN_FILTER }, async (args) => {
				// Exclude node_modules (at least for now)
				if (args.importer.includes("node_modules/")) return;

				const importPath = resolveSync(args.path, path.dirname(args.importer));
				console.log("Import:", importPath);
				const file = Bun.file(importPath);
				const inputCode = await file.text();

				if (
					inputCode.startsWith(`"use client"`) ||
					inputCode.startsWith(`'use client'`)
				) {
					config.clientEntryPoints.add(importPath);
					console.log("CLIENT COMPONENT detected", config.clientEntryPoints);
					console.log(args.path, args.importer);

					const componentPath = resolveSync(
						args.path,
						path.dirname(args.importer),
					);
					console.log("New path:", componentPath);

					return {
						path: componentPath,
						external: false,
						namespace: "rsc",
					};
				}

				return null;
			});

			build.onLoad({ filter: /.*/, namespace: "rsc" }, async (args) => {
				console.log(args);
				// const [, exports] = parse(args.path);
				// console.log("resolveSync", args.path, process.cwd());
				// const path = resolveSync(args.path, process.cwd());
				console.log(args.path);
				const file = Bun.file(args.path);

				const input = await file.text();
				console.log(input);

				const transpiledInput = transpiler.transformSync(input);

				const [, exports] = parse(transpiledInput);

				let contents = input;

				for (const exp of exports) {
					const key = Bun.hash(input + exp).toString();

					config.clientComponentsMap.set(key, {
						id: `/build${args.path}`,
						name: exp.n,
						chunks: [],
						async: true,
					});

					const addContent = `
						${exp.ln}.$$typeof = Symbol.for('react.client.reference');
						${exp.ln}.$$id = ${JSON.stringify(
							`./build/client/components/Counter.js#${exp.n}"`,
						)};
					`;

					// const addContent = `
					// 	${exp.ln}.$$typeof = Symbol.for('react.client.reference');
					// 	${exp.ln}.$$id = ${JSON.stringify(key)};
					// `;

					console.log({ addContent });
					contents += addContent;
				}

				const placeholderContent =
					"export const Counter = () => {return (<div>Counter Placeholder</div>);}";

				return {
					// loader: "",
					// contents,
					contents: placeholderContent,
				};
			});
		},
	};
};
