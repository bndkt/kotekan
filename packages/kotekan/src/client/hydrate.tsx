/// <reference lib="dom" />
import { StrictMode, type ReactNode } from "react";
import { hydrateRoot } from "react-dom/client";
// @ts-ignore
import { createFromFetch } from "react-server-dom-esm/client";

createFromFetch(fetch("?jsx")).then((response: ReactNode) =>
	hydrateRoot(document, <StrictMode>{response}</StrictMode>),
);
