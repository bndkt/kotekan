"use server";
// import { css, html } from "react-strict-dom";
// import stylex from "@stylexjs/stylex";

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
			<div /* {...stylex.props(styles.red)} */>Hello from the server!</div>
			<ul>
				<li>Before: {msBefore}</li>
				<li>After: {msAfter}</li>
			</ul>
		</>
	);
}
