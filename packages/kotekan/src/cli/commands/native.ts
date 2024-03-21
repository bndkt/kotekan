import path from "node:path";
import type { ArgumentsCamelCase } from "yargs";

import { metro } from "../../native/metro";
import { install } from "../../native/install";
import { generate } from "../../native/generate";

export const command = "native [--development]";

export const describe = "Start a Kotekan native server";

export const builder = {
	development: {
		default: false,
	},
};

export const handler = async ({
	development,
}: ArgumentsCamelCase<{ development: boolean }>) => {
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
