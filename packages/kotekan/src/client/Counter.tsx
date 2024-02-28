import { useState } from "react";

export function Counter() {
	const [counter, setCounter] = useState(0);

	return (
		<button type="button" onClick={() => setCounter((prev) => prev + 1)}>
			Counter: {counter}
		</button>
	);
}
