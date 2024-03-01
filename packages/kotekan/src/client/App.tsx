import { StrictMode } from "react";

import Root from "../../../../apps/web/src/root";
import { Router } from "./Router";

const RENDER = process.env.RENDER as string;

export const App = () => {
	return (
		<StrictMode>
			<Root>{RENDER && <Router />}</Root>
		</StrictMode>
	);
};
