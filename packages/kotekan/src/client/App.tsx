import { StrictMode } from "react";

import Root from "../../../../apps/web/src/root";
import { Router } from "./Router";
import { ErrorBoundary } from "./ErrorBoundary";

const RENDER = process.env.RENDER as string;

console.log({ RENDER });

export const App = () => {
	return (
		<StrictMode>
			<ErrorBoundary>
				<Root>{RENDER && <Router />}</Root>
			</ErrorBoundary>
		</StrictMode>
	);
};
