import path from "node:path";

import { metro } from "../../native/metro";
import { install } from "../../native/install";
import { generate } from "../../native/generate";

const development = Bun.env.NODE_ENV === "development";

export const nativeCommand = async () => {
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
