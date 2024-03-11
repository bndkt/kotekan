import { Suspense } from "react";

import { ServerComponent } from "../../components/demo/ServerComponent";

export default function Timestamp() {
	return (
		<>
			<title>About - Kotekan</title>
			<h1>Timestamp demo</h1>
			<p>Currently featuring a hydration error 🤪</p>
			<Suspense fallback={<div>Loading server component &hellip;</div>}>
				{/* @ts-expect-error Async component */}
				<ServerComponent />
			</Suspense>
		</>
	);
}
