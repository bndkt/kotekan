import { resolveSync } from "bun";

interface FetchProps {
	rnBuild?: string;
	buildPath: string;
}

export const fetch = async (
	request: Request,
	{ rnBuild, buildPath }: FetchProps,
): Promise<Response> => {
	const url = new URL(request.url);
	const pathSegments = url.pathname.split("/").filter(Boolean);
	const userAgent = request.headers.get("user-agent");
	// console.log({ url, userAgent });

	console.log(url.pathname, request.method, request.headers);

	if (url.pathname === "/") {
		const res = JSON.stringify({ message: "Hello, world!" });

		return new Response(res);
	}

	if (url.pathname === "/index.bundle") {
		const res = JSON.stringify({ message: "magic" });
		const staticDemoBundleFilePath = resolveSync(
			"./src/bundle.js",
			process.cwd(),
		);
		const staticDemoBundle = Bun.file(staticDemoBundleFilePath);

		return new Response(staticDemoBundle);
	}

	if (url.pathname === "/status") {
		return new Response("packager-status:running");
	}

	return new Response(null, { status: 404 });
};
