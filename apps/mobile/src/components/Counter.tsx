"use client";
import { useState } from "react";
// import { css, html as h } from "react-strict-dom";

export const Counter = () => {
	const [counter, setCounter] = useState(0);

	return (
		<button type="button" onClick={() => setCounter(counter + 1)}>
			Counter: {counter}
		</button>
	);
};
