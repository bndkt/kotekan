// import { css, html as h } from "react-strict-dom";

const dockerBuildTimestamp = Number(process.env.DOCKER_BUILD_TIMESTAMP);
// const dockerBuildTimestamp = Number(process.env.DOCKER_BUILD_TIMESTAMP);
const dockerBuildDate = Number.isNaN(dockerBuildTimestamp)
	? null
	: new Date(dockerBuildTimestamp * 1000);

export const ServerComponent = async () => {
	const msBefore = Bun.nanoseconds();

	// await new Promise((resolve) => setTimeout(resolve, 3000));

	const msAfter = Bun.nanoseconds();

	return (
		<>
			<div>Hello from the server!</div>
			<ul>
				<li>
					Docker build timestamp:{" "}
					{dockerBuildDate ? dockerBuildDate.toLocaleString() : "n/a"}
				</li>
				<li>Before: {msBefore}</li>
				<li>After: {msAfter}</li>
			</ul>
		</>
	);
};
