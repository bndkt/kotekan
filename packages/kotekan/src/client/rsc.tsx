/// <reference lib="dom" />
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
// @ts-ignore
import { createFromFetch } from "react-server-dom-esm/client";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

createFromFetch(fetch("/rsc")).then((response: ReactNode) =>
	root.render(response),
);
