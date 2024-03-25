import type { BunPlugin } from "bun";
import type { Rule } from "@stylexjs/babel-plugin";

import { babel } from "./babel";
import { rsc } from "./rsc";

interface RscPluginConfig {
	clientComponentPaths?: Set<string>;
	server?: boolean;
	stylexRules?: Record<string, Rule[]>;
	development?: boolean;
}

// const PLUGIN_FILTER = /\.(jsx|js|tsx|ts|mjs|cjs|mts|cts)$/;
const PLUGIN_FILTER = /\.(ts|tsx)$/;

export const kotekanPlugin: (config: RscPluginConfig) => BunPlugin = ({
	clientComponentPaths,
	server,
	stylexRules,
	development,
}) => {
	return {
		name: "kotekanPlugin",
		setup(build) {
			// console.log("🥁 RSC PLUGIN SETUP");

			build.onLoad({ filter: PLUGIN_FILTER }, async (args) => {
				const pathSegments = args.path.split("/");
				let contents = await Bun.file(args.path).text();

				// console.log("🥁 RSC PLUGIN ON LOAD", args.path);

				if (pathSegments.includes("node_modules")) {
					console.log("Skipping", args.path);
					return;
				}

				// Babel (StyleX, React Refresh)
				contents = await babel(contents, { args, stylexRules, development });

				// RSC
				if (server) {
					contents = await rsc(contents, { args, clientComponentPaths });
				}

				return {
					contents,
					loader: args.loader,
				};
			});
		},
	};
};
