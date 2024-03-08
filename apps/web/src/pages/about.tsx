import * as stylex from "@stylexjs/stylex";

import { Counter } from "../components/Counter.tsx";
import { LikeButton } from "../components/LikeButton.tsx";

const styles = stylex.create({
	orange: {
		color: "orange",
	},
});

export default function About() {
	return (
		<>
			<title>About - Kotekan</title>
			<h1 {...stylex.props(styles.orange)}>Kotekan - About</h1>
			<a href="/">Home</a>
			<Counter start={8 /* Bun.nanoseconds() */} />
			{/* <LikeButton /> */}
		</>
	);
}
