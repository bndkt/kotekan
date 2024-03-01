/// <reference lib="dom" />
import { createRoot } from "react-dom/client";
// @ts-ignore
import { createFromFetch } from "react-server-dom-esm/client";

import { Router } from "./Router";
import type { ReactNode } from "react";

console.log("RENDER");

const root = createRoot(document.body);

// createFromFetch(fetch("?jsx")).then((response: ReactNode) =>
// 	root.render(response),
// );

root.render(<Router />);
