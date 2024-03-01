import {
	lazy,
	Suspense,
	type LazyExoticComponent,
	type ReactNode,
} from "react";

import { NotFound } from "./NotFound";

const LOCATION = process.env.LOCATION as string | undefined;
const timeout = 0;

// const Index = lazy(() => import("../../../../apps/web/src/pages/index"));
const Index = lazy(() =>
	Promise.all([
		import("../../../../apps/web/src/pages/index"),
		new Promise((resolve) => setTimeout(resolve, timeout)),
	]).then(([moduleExports]) => {
		return moduleExports;
	}),
);
// const About = lazy(() => import("../../../../apps/web/src/pages/about"));
const About = lazy(() =>
	Promise.all([
		import("../../../../apps/web/src/pages/about"),
		new Promise((resolve) => setTimeout(resolve, timeout)),
	]).then(([moduleExports]) => {
		return moduleExports;
	}),
);

export const Router = ({ location }: { location?: string }) => {
	location = location ?? LOCATION ?? "/";

	const routes = new Map<string, LazyExoticComponent<() => ReactNode>>();
	routes.set("/", Index);
	routes.set("/about", About);

	const RouteComponent = routes.get(location) ?? NotFound;

	return (
		<>
			<div>Router: {location}</div>
			<Suspense fallback={<div>Loading...</div>}>
				<RouteComponent />
			</Suspense>
		</>
	);
};
