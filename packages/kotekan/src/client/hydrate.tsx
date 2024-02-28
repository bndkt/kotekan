/// <reference lib="dom" />
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import { App } from "./App";

console.log("Location", process.env.LOCATION);

hydrateRoot(
	document,
	<StrictMode>
		<App />
	</StrictMode>,
);
