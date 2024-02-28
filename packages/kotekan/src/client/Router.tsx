import { lazy, type LazyExoticComponent, type ReactNode } from "react";

import Root from "../../../../apps/web/src/root";
import { NotFound } from "./NotFound";

const Index = lazy(() => import("../../../../apps/web/src/pages/index"));
const About = lazy(() => import("../../../../apps/web/src/pages/about"));

export function Router({ location }: { location: string }) {
	const routes = new Map<string, LazyExoticComponent<() => ReactNode>>();
	routes.set("/", Index);
	routes.set("/about", About);

	const RouteComponent = routes.get(location) ?? NotFound;

	return (
		<Root>
			<div>Router: {location}</div>
			<RouteComponent />
		</Root>
	);
}
