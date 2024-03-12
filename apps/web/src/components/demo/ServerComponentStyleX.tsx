import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
	green: {
		color: "green",
	},
});

export const ServerComponentStyleX = async () => {
	const msBefore = Bun.nanoseconds();
	await Bun.sleep(1000);
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
