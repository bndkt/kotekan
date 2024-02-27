// if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
// 	const runtime = require("react-refresh/runtime");
// 	runtime.injectIntoGlobalHook(window);
// 	window.$RefreshReg$ = () => {};
// 	window.$RefreshSig$ = () => (type) => type;
// 	console.log("Fast Refresh setup complete");
// }

import { Suspense } from "react";
// import { css, html } from "react-strict-dom";
import stylex from "@stylexjs/stylex";

import { Counter } from "./counter";

const styles = stylex.create({
	red: {
		color: "red",
	},
});

export default function Root() {
	// console.log(styles);

	return (
		<html lang="en">
			<head>
				<title>Kotekan</title>
			</head>
			<body>
				{/* <App /> */}
				<h1 {...stylex.props(styles.red)}>Kotekan Web 1</h1>
				<Suspense fallback={<div>Loading ...</div>}>
					<Counter />
				</Suspense>
			</body>
		</html>
	);
}
