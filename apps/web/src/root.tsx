import { Suspense } from "react";
import { Counter } from "./counter";

export default function Root() {
	return (
		<html lang="en">
			<head>
				<title>Kotekan</title>
			</head>
			<body>
				{/* <App /> */}
				<h1>Kotekan Web</h1>
				<Suspense fallback={<div>Loading ...</div>}>
					<Counter />
				</Suspense>
			</body>
		</html>
	);
}
