import path from "node:path";

import { server } from "../server";

const SOCKET = "/tmp/kotekan.sock";

export const startCommand = async (development = false) => {
	const ssrServerPort = 3000;
	const jsxServerPort = 3001;

	const jsxServerPath = path.join(import.meta.dir, "jsxServer.ts");
	const jsxServer = Bun.spawn(
		["bun", "--conditions", "react-server", jsxServerPath],
		{
			stdout: "inherit",
			env: {
				PORT: jsxServerPort.toString(),
				SOCKET,
				...process.env,
			},
		},
	);

	await server({
		mode: "ssr",
		port: ssrServerPort,
		socket: SOCKET,
		mdxEnabled: true,
		development,
	});

	console.log(`Kotekan running at http://localhost:${ssrServerPort}`);
};
