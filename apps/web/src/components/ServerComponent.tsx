import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
	green: {
		color: "green",
	},
});

export const ServerComponent = async () => {
	const msBefore = Bun.nanoseconds();

	await new Promise((resolve) => setTimeout(resolve, 3000));

	const msAfter = Bun.nanoseconds();

	return (
		<>
			<div {...stylex.props(styles.green)}>Hello from the server!</div>
			<ul>
				<li>Before: {msBefore}</li>
				<li>After: {msAfter}</li>
			</ul>
		</>
	);
};
