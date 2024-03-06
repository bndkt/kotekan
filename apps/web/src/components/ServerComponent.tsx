// @ts-expect-error Missing types
import { css, html as h } from "react-strict-dom";

const styles = css.create({
	green: {
		color: "green",
	},
});

export const ServerComponent = async () => {
	const msBefore = Bun.nanoseconds();

	await new Promise((resolve) => setTimeout(resolve, 1000));

	const msAfter = Bun.nanoseconds();

	return (
		<>
			<h.div style={styles.green}>Hello from the server!</h.div>
			<h.ul>
				<h.li>Before: {msBefore}</h.li>
				<h.li>After: {msAfter}</h.li>
			</h.ul>
		</>
	);
};
