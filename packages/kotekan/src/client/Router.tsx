import {
	lazy,
	Suspense,
	type LazyExoticComponent,
	type ReactNode,
} from "react";

import { NotFound } from "./NotFound";

export type Routes = Record<string, string>;

export const Router = ({
	location,
	routes,
}: { location?: string; routes?: Routes }) => {
	location = location ?? "/";

	const routeComponents = new Map<
		string,
		LazyExoticComponent<() => ReactNode>
	>();

	for (const routeName in routes) {
		routeComponents.set(
			routeName,
			lazy(() => import(routes[routeName])),
		);
	}

	const RouteComponent = routeComponents.get(location) ?? NotFound;

	return (
		<>
			<div>Router: {location}</div>
			<Suspense fallback={<div>Loading route &hellip;</div>}>
				<RouteComponent />
			</Suspense>
		</>
	);
};
