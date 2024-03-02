/// <reference lib="dom" />
import { StrictMode, type ReactNode } from "react";
import { hydrateRoot } from "react-dom/client";
// @ts-ignore
import { createFromFetch } from "react-server-dom-esm/client";

// import { Document } from "./Document";

const STYLESHEET = process.env.STYLESHEET as string;

console.log("HYDRATE", { STYLESHEET });

createFromFetch(fetch("?jsx")).then((response: ReactNode) =>
	hydrateRoot(document, response),
);

// hydrateRoot(
// 	document,
// 	<StrictMode>
// 		<Document stylesheet={STYLESHEET} />
// 	</StrictMode>,
// );
