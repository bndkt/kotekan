"use client";
import { useState } from "react";

export const Counter = () => {
	const [counter, setCounter] = useState(0);
	// const counter = 1;

	return (
		<button type="button" onClick={() => setCounter(counter + 1)}>
			Counter: {counter}
		</button>
	);
};

// export default Counter;
