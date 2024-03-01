/// <reference lib="dom" />
import type { ReactNode } from "react";
import { hydrateRoot } from "react-dom/client";
// @ts-ignore
import { createFromFetch } from "react-server-dom-esm/client";

import { App } from "./App";

const RSC_ENABLED = process.env.RSC_ENABLED;

console.log("HYDRATE", { RSC_ENABLED });

hydrateRoot(document, <App />);

if (RSC_ENABLED) {
	createFromFetch(fetch("/rsc")).then((response: ReactNode) =>
		hydrateRoot(document, response),
	);
}
