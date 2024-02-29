// @ts-expect-error Missing types
import { css, html as h } from "react-strict-dom";

import { Counter } from "../components/Counter.tsx";

export default function About() {
	return (
		<>
			<h.h1>Kotekan - About</h.h1>
			<h.a href="/">Home</h.a>
			{/* <Counter /> */}
		</>
	);
}
