import { Suspense } from "react";

import { ServerTime } from "@/components/ServerTime";
import { Counter } from "@/components/Counter";

export default function Index() {
	return (
		<>
			<title>Kotekan</title>
			<p>Hello, world!</p>
			<Counter />
			<Suspense fallback="Loading &hellip;">
				{/* @ts-expect-error Async component */}
				<ServerTime />
			</Suspense>
		</>
	);
}
