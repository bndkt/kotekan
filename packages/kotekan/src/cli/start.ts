#!/usr/bin/env bun
import path from "node:path";

export const startCommand = async () => {
	const jsxServerPath = path.join(import.meta.dir, "jsxServer.ts");
	const jsxServerPort = 3001;
	const jsxServer = Bun.spawn(
		["bun", "--conditions", "react-server", jsxServerPath],
		{
			env: { PORT: jsxServerPort.toString(), ...process.env },
			stdout: "inherit",
		},
	);

	const ssrServerPath = path.join(import.meta.dir, "ssrServer.ts");
	const ssrServerPort = 3000;
	const ssrServer = Bun.spawn(["bun", ssrServerPath], {
		env: { PORT: ssrServerPort.toString(), ...process.env, stdout: "inherit" },
	});

	console.log(`Kotekan running at http://localhost:${ssrServerPort}`);
};
