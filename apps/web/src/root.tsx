import { Suspense } from "react";
// import { css, html } from "react-strict-dom";
import * as stylex from "@stylexjs/stylex";

import { Counter } from "./counter";

// const styles = stylex.create({
// 	red: {
// 		color: "red",
// 	},
// });

export default function Root() {
	return (
		<html lang="en">
			<head>
				<title>Kotekan</title>
			</head>
			<body>
				{/* <App /> */}
				<h1 /* {...stylex.props(styles.red)} */>Kotekan Web</h1>
				<Suspense fallback={<div>Loading ...</div>}>
					<Counter />
				</Suspense>
			</body>
		</html>
	);
}
