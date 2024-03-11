import { Suspense } from "react";

import { Counter } from "../components/Counter";
import { ServerComponent } from "../components/ServerComponent";
import { HeroPattern } from "../components/layout/HeroPattern";

export default function Index() {
	return (
		<>
			<title>Home - Kotekan</title>
			<HeroPattern />
			<h1>Hello, world!</h1>
			<a href="/about">About</a>
			<p className="text-red-500">
				This should be red if Tailwind works 23456.
			</p>
			<Suspense fallback={<div>Loading server component &hellip;</div>}>
				<ServerComponent />
			</Suspense>
			<Counter />
		</>
	);
}
