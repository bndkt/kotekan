/// <reference lib="dom" />
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import { default as Root } from "../../../../apps/web/src/root";

// import { Root } from "virtual-root";

hydrateRoot(
	document,
	<StrictMode>
		<Root />
	</StrictMode>,
);
