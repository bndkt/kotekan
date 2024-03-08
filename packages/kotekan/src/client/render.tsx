/// <reference lib="dom" />
import { type ReactNode } from "react";
import { createRoot } from "react-dom/client";
// @ts-expect-error Untyped import
import { createFromFetch } from "react-server-dom-esm/client";

import { setupNavigation } from "./setupNavigation";

const root = createRoot(document.body);
const moduleBaseURL = "/_build/components";

createFromFetch(
	fetch("?jsx", {
		headers: {
			Accept: "text/x-component",
		},
	}),
	{ moduleBaseURL },
).then((response: ReactNode) => root.render(response));

setupNavigation(root);
