import path from "node:path";
import type { ArgumentsCamelCase, BuilderCallback } from "yargs";

import { metro } from "../../native/metro";
import { install } from "../../native/install";
import { generate } from "../../native/generate";

export const command = "native [--development]";

export const describe = "Start a Kotekan native server";

interface Args {
	development?: boolean;
}

export const builder: BuilderCallback<Args, Args> = (yargs) => {
	return yargs.option("development", {
		type: "boolean",
		default: false,
		alias: "d",
	});
};

export const handler = async ({ development }: ArgumentsCamelCase<Args>) => {
	const buildDir = "./build";
	const targetName = "KotekanApp";
	const displayName = "Kotekan";
	const buildPath = path.join(process.cwd(), buildDir, "mobile");

	await generate({
		buildPath,
		targetName,
		displayName,
	});

	await install({ buildPath });

	// await metro();

	Bun.spawn(
		["react-native", "start", "--config", "./build/mobile/metro.config.cjs"],
		{
			stdout: "inherit",
			env: {
				// PORT: ssrServerPort.toString(),
				...process.env,
			},
		},
	);

	console.log("Native");
};
