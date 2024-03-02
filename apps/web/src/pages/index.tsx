import { Suspense } from "react";
// @ts-expect-error Missing types
import { css, html as h } from "react-strict-dom";

// import { ServerComponent } from "../components/ServerComponent.tsx";

const styles = css.create({
	red: {
		color: "red",
	},
});

export default function Index() {
	return (
		<>
			<h.h1 style={styles.red}>Kotekan - Index</h.h1>
			<h.a href="/about">About</h.a>

			<h.div>Hello from react-strict-dom</h.div>

			<Suspense fallback={<h.div>Loading...</h.div>}>
				{/* @ts-expect-error Async component */}
				{/* <ServerComponent /> */}
			</Suspense>
		</>
	);
}
