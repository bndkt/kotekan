import { useState } from "react";

export function Counter() {
	const [counter, setCounter] = useState(0);

	return (
		<button type="button" onClick={() => setCounter(counter + 1)}>
			Counter: {counter}
		</button>
	);
}
