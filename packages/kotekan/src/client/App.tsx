import { StrictMode } from "react";

import Root from "../../../../apps/web/src/root";
import { Router } from "./Router";

const RENDER = process.env.RENDER as string;

export const App = ({ stylesheet }: { stylesheet: string }) => {
	return (
		<StrictMode>
			{/* <link rel="stylesheet" href={stylesheet} precedence="default" /> */}
			<Root>{RENDER && <Router />}</Root>
		</StrictMode>
	);
};
