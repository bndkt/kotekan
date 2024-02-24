import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import { default as Root } from "../../../../apps/web/src/root";

hydrateRoot(
	document,
	<StrictMode>
		<Root />
	</StrictMode>,
);
