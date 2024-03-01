/// <reference lib="dom" />
import { createRoot } from "react-dom/client";
// @ts-ignore
import { createFromFetch } from "react-server-dom-esm/client";

import { Router } from "./Router";
import type { ReactNode } from "react";

const RSC_ENABLED = process.env.RSC_ENABLED;

console.log("RENDER", { RSC_ENABLED });

const root = createRoot(document.body);

if (RSC_ENABLED) {
	createFromFetch(fetch("/rsc")).then((response: ReactNode) =>
		root.render(response),
	);
} else {
	root.render(<Router />);
}
