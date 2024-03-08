"use client";
import { useState } from "react";

export const Counter = ({ start }: { start: number }) => {
	const [counter, setCounter] = useState(start);
	// const counter = 1;

	return (
		<button type="button" onClick={() => setCounter(counter + 1)}>
			Counter: {counter}
		</button>
	);
};

// export default Counter;
