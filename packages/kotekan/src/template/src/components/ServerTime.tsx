export const ServerTime = async () => {
	const msBefore = Bun.nanoseconds();

	await new Promise((resolve) => setTimeout(resolve, 3000));

	const msAfter = Bun.nanoseconds();

	return (
		<>
			<div>Hello from the server!</div>
			<ul>
				<li>Before: {msBefore}</li>
				<li>After: {msAfter}</li>
			</ul>
		</>
	);
};
