"use client";
import { useState } from "react";
// @ts-expect-error Missing types
import { css, html as h } from "react-strict-dom";

export function Counter() {
	const [counter, setCounter] = useState(0);

	return (
		<h.button type="button" onClick={() => setCounter(counter + 1)}>
			Counter: {counter}
		</h.button>
	);
}
