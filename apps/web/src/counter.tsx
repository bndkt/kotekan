import { useState } from "react";

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function Counter() {
	const [counter, setCounter] = useState(0);

	new Promise((resolve) => setTimeout(resolve, 200));

	return (
		<button type="button" onClick={() => setCounter(counter + 1)}>
			Counter: {counter}
		</button>
	);
}
