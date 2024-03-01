/// <reference lib="dom" />
import type { ReactNode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
// @ts-ignore
import { createFromFetch } from "react-server-dom-esm/client";

const root = createRoot(document.body);

createFromFetch(fetch("/rsc")).then((response: ReactNode) =>
	// root.render(response),
	hydrateRoot(document, response),
);
