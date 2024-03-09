// @ts-expect-error Missing types
import { css, html as h } from "react-strict-dom";

// const styles = css.create({
// 	green: {
// 		color: "green",
// 	},
// });

export const ServerComponentStrict = async () => {
	const msBefore = Bun.nanoseconds();
	await Bun.sleep(1000);
	const msAfter = Bun.nanoseconds();

	return (
		<>
			<h.div>Test</h.div>
			{/* <h.div style={styles.green}>Hello from the server2!</h.div>
			<h.ul>
				<h.li>Before: {msBefore}</h.li>
				<h.li>After: {msAfter}</h.li>
			</h.ul> */}
		</>
	);
};
