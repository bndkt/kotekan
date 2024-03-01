/// <reference lib="dom" />
import type { ReactNode } from "react";
import { hydrateRoot } from "react-dom/client";
// @ts-ignore
import { createFromFetch } from "react-server-dom-esm/client";

import { App } from "./App";

const RSC_ENABLED = process.env.RSC_ENABLED;
const STYLESHEET = process.env.RSC_ENABLED as string;

console.log("HYDRATE", { RSC_ENABLED, STYLESHEET });

createFromFetch(fetch("?jsx")).then((response: ReactNode) =>
	hydrateRoot(document, response),
);

// hydrateRoot(document, <App stylesheet={STYLESHEET} />);
