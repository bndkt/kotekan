"use server";
// @ts-expect-error Missing types
import { css, html as h } from "react-strict-dom";

// const styles = stylex.create({
// 	red: {
// 		color: "red",
// 	},
// });

export async function ServerComponent() {
	const msBefore = Bun.nanoseconds();

	await new Promise((resolve) => setTimeout(resolve, 5000));

	const msAfter = Bun.nanoseconds();

	return (
		<>
			<h.div /* {...stylex.props(styles.red)} */>Hello from the server!</h.div>
			<h.ul>
				<h.li>Before: {msBefore}</h.li>
				<h.li>After: {msAfter}</h.li>
			</h.ul>
		</>
	);
}
