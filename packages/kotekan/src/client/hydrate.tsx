/// <reference lib="dom" />
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
// @ts-expect-error Untyped import
import { createFromFetch } from "react-server-dom-esm/client";

import { setupNavigation } from "./setupNavigation";

const hydrate = await createFromFetch(
	fetch("?jsx", {
		headers: {
			Accept: "text/x-component",
		},
	}),
	{},
);
const root = hydrateRoot(document, <StrictMode>{hydrate}</StrictMode>);

setupNavigation(root);
