import { Suspense } from "react";
import * as stylex from "@stylexjs/stylex";

import { ServerComponent } from "../components/ServerComponent.tsx";

const styles = stylex.create({
	red: {
		color: "red",
	},
});

export default function Index() {
	return (
		<>
			<title>Kotekan</title>

			<h1 style={styles.red}>Kotekan - Index</h1>
			<a href="/about">About</a>
			<a href="/blog">Blog</a>
			<a href="/pokemon">Pokémon</a>

			<div>Hello from react-strict-dom</div>

			<Suspense fallback={<div>Loading &hellip;</div>}>
				{/* @ts-expect-error Async component */}
				<ServerComponent />
			</Suspense>
		</>
	);
}
