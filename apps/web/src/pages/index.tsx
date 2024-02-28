import { Suspense } from "react";
import stylex from "@stylexjs/stylex";

import { ServerComponent } from "../ServerComponent";

const styles = stylex.create({
	red: {
		color: "red",
	},
});

export default function Index() {
	return (
		<>
			<h1 {...stylex.props(styles.red)}>Kotekan - Index</h1>
			<a href="/about">About</a>

			<Suspense fallback={<div>Loading...</div>}>
				{/* @ts-expect-error Async component */}
				{/* <ServerComponent /> */}
			</Suspense>
		</>
	);
}
