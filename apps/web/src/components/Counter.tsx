"use client";
import { useState } from "react";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
	button: {
		backgroundColor: "orange",
	},
});

export const Counter = ({ start }: { start: number }) => {
	const [counter, setCounter] = useState(start);
	// const counter = 1;

	return (
		<button
			type="button"
			onClick={() => setCounter(counter + 1)}
			{...stylex.props(styles.button)}
		>
			Counter: {counter}
		</button>
	);
};

// export default Counter;
