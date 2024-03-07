/// <reference lib="dom" />
import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
// @ts-expect-error Untyped import
import { createFromFetch } from "react-server-dom-esm/client";

import { setupNavigation } from "./setupNavigation";

const root = createRoot(document.body);

createFromFetch(
	fetch("?jsx", {
		headers: {
			Accept: "text/x-component",
		},
	}),
	{},
).then((response: ReactNode) =>
	root.render(<StrictMode>{response}</StrictMode>),
);

setupNavigation(root);
