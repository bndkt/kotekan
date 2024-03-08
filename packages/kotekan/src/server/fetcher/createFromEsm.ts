import path from "node:path";
import { Transform } from "node:stream";
import { pathToFileURL } from "bun";
// @ts-expect-error Untyped import
import { createFromFetch } from "react-server-dom-esm/client.browser";
// @ts-expect-error Untyped import
import { createFromNodeStream } from "react-server-dom-esm/client.node";

export const createFromEsm = async (jsxFetch: Promise<Response>) => {
	const moduleRootPath = pathToFileURL(
		path.join(process.cwd(), "build", "client", "components"),
	).href;
	const moduleBaseURL =
		"/Users/bndkt/Developer/GitHub/kotekan/apps/web/build/client/components";
	const options = {};

	// >>> createFromFetch
	// return createFromFetch(jsxFetch, moduleRootPath, moduleBaseURL, options);

	// >>> createFromNodeStream
	const nodeStream = new Transform();
	const jsxResponse = await jsxFetch;

	if (!jsxResponse.body) {
		throw new Error("No body found in response");
	}

	jsxResponse.body.pipeTo(
		new WritableStream({
			write(value) {
				nodeStream.push(value);
			},
			close() {
				nodeStream.push(null);
			},
		}),
	);

	// createFromNodeStream(stream, moduleRootPath, moduleBaseURL, options)
	return createFromNodeStream(
		nodeStream,
		moduleRootPath,
		moduleBaseURL,
		options,
	);
};
