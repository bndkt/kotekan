// if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
// 	const runtime = require("react-refresh/runtime");
// 	runtime.injectIntoGlobalHook(window);
// 	window.$RefreshReg$ = () => {};
// 	window.$RefreshSig$ = () => (type) => type;
// 	console.log("Fast Refresh setup complete");
// }
import Root from "../../../../apps/web/src/root"; // @todo
import { Router, type Routes } from "./Router";

const HYDRATE = process.env.HYDRATE as string | undefined;
const LOCATION = process.env.LOCATION as string | undefined;
const ROUTES = process.env.ROUTES as Routes | undefined;

export const Document = ({ stylesheet }: { stylesheet: string }) => {
	return (
		<>
			{stylesheet && (
				<link rel="stylesheet" href={stylesheet} precedence="default" />
			)}
			<Root>{HYDRATE && <Router location={LOCATION} routes={ROUTES} />}</Root>
		</>
	);
};
