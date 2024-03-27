import {
	use,
	useState,
	type Usable,
	createElement,
	startTransition,
	type Dispatch,
	type FunctionComponent,
} from "react";
import { hydrateRoot } from "react-dom/client";
import {
	createFromReadableStream,
	createFromFetch,
	encodeReply,
	// @ts-expect-error Untyped import
} from "@physis/react-server-dom-esm/client";

import { moduleBaseURL } from "./config";
import { setupNavigation } from "./setupNavigation";
import { jsxPayloadStream } from "./jsxPayload";

let updateRoot: Dispatch<string>;

async function callServer(id: string, args: string) {
	const response = fetch("?jsx", {
		method: "post",
		headers: {
			Accept: "text/x-component",
			"rsc-action": id,
		},
		body: await encodeReply(args),
	});

	const { returnValue, root } = await createFromFetch(response, {
		callServer,
		moduleBaseURL,
	});

	startTransition(() => {
		updateRoot(root);
	});

	return returnValue;
}

const data = createFromReadableStream(
	// fetch("?jsx", {
	// 	headers: {
	// 		Accept: "text/x-component",
	// 	},
	// }),
	jsxPayloadStream,
	{
		callServer,
		moduleBaseURL,
	},
);

const Shell: FunctionComponent<{ data: Usable<() => string> }> = ({ data }) => {
	const [root, setRoot] = useState(use(data));

	updateRoot = setRoot;

	return root;
};

const root = hydrateRoot(document, createElement(Shell, { data }));

// const root = hydrateRoot(document, <StrictMode>{hydrate}</StrictMode>);

setupNavigation(root);
