import { Suspense } from "react";

import { ServerComponent } from "../ServerComponent";

export default function Index() {
	return (
		<>
			<h1>Kotekan - Index</h1>
			<a href="/about">About</a>

			<Suspense fallback={<div>Loading...</div>}>
				{/* @ts-expect-error Async component */}
				{/* <ServerComponent /> */}
			</Suspense>
		</>
	);
}
