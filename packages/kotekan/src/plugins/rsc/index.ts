import path from "node:path";
import { resolveSync, type BunPlugin, pathToFileURL } from "bun";
import {
	resolve,
	load as reactLoad,
	getSource as getSourceImpl,
	transformSource as reactTransformSource,
	// @ts-expect-error Untyped import
} from "react-server-dom-esm/node-loader";

import type { ClientComponentsMap, ClientEntryPoints } from "../../builder";

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
				// console.log("Import:", importPath);
				const file = Bun.file(importPath);
				const inputCode = await file.text();

				if (
					inputCode.startsWith(`"use client"`) ||
					inputCode.startsWith(`'use client'`)
				) {
					config.clientEntryPoints.add(importPath);
					// console.log("CLIENT COMPONENT detected", config.clientEntryPoints);
					// console.log(args.path, args.importer);

					const componentPath = resolveSync(
						args.path,
						path.dirname(args.importer),
					);
					// componentPath = componentPath.replace(".tsx", ".js");
					// componentPath = componentPath.replace("src/", "build/client/");
					// console.log({ componentPath });

					return {
						path: componentPath,
						external: false,
						namespace: "rsc",
					};
				}

				return null;
			});

			build.onLoad({ filter: /.*/, namespace: "rsc" }, async (args) => {
				const file = Bun.file(args.path);
				const source = await file.text();

				const defaultLoad = (
					url: string,
					context: unknown,
					defaultLoad: () => void,
				) => {
					return {
						format: "module",
						source,
					};
				};

				const path = args.path
					.replace(".tsx", ".js")
					.replace("src/", "build/client/");
				const url = new URL(pathToFileURL(path)).href;
				// console.log("🎯 OK 1", url);
				const context = "";
				const { source: contents } = await reactLoad(url, context, defaultLoad);
				// console.log("🎯 OK 2", contents);

				// console.log(args);
				// const [, exports] = parse(args.path);
				// console.log("resolveSync", args.path, process.cwd());
				// const path = resolveSync(args.path, process.cwd());
				// console.log(args.path);

				// console.log(input);

				// const transpiledInput = transpiler.transformSync(input);

				// const [, exports] = parse(transpiledInput);

				// let contents = input;

				// for (const exp of exports) {
				// 	const key = Bun.hash(input + exp).toString();

				// 	// config.clientComponentsMap.set(key, {
				// 	// 	id: `/build${args.path}`,
				// 	// 	name: exp.n,
				// 	// 	chunks: [],
				// 	// 	async: true,
				// 	// });

				// 	const addContent = `
				// 		${exp.ln}.$$typeof = Symbol.for('react.client.reference');
				// 		${exp.ln}.$$id = ${JSON.stringify(
				// 			`/Users/bndkt/Developer/GitHub/kotekan/apps/web/src/components/Counter.js#${exp.n}`,
				// 		)};
				// 	`;

				// 	// const addContent = `
				// 	// 	${exp.ln}.$$typeof = Symbol.for('react.client.reference');
				// 	// 	${exp.ln}.$$id = ${JSON.stringify(key)};
				// 	// `;

				// 	// console.log({ addContent });
				// 	contents += addContent;
				// }

				const placeholderContent =
					"export const Counter = () => {return (<div>Counter Placeholder</div>);}";

				// contents = transformSource(input);

				return {
					loader: "tsx",
					contents,
					// contents: placeholderContent,
				};
			});
		},
	};
};
