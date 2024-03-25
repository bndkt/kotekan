"use client";
import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
// import { css, html as h } from "react-strict-dom";

const styles = stylex.create({
	button: {
		backgroundColor: "#007bff",
		color: "white",
	},
});

export const Counter = () => {
	const [counter, setCounter] = useState(0);

	return (
		<button
			// style={styles.button}
			{...stylex.props(styles.button)}
			type="button"
			onClick={() => setCounter(counter + 1)}
		>
			Counter: {counter}
		</button>
	);
};
