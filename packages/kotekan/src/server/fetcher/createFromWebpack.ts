// @ts-expect-error Untyped import
import { createFromFetch } from "react-server-dom-webpack/client.edge";

export const createFromWebpack = async (jsxFetch: Promise<Response>) => {
	return createFromFetch(jsxFetch, {
		ssrManifest: {
			moduleMap: {},
			moduleLoading: {},
			encodeFormAction: undefined,
			nonce: undefined,
		},
	});
};
