// if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
// 	const runtime = require("react-refresh/runtime");
// 	runtime.injectIntoGlobalHook(window);
// 	window.$RefreshReg$ = () => {};
// 	window.$RefreshSig$ = () => (type) => type;
// 	console.log("Fast Refresh setup complete");
// }
import type { ReactNode } from "react";
// @ts-expect-error Missing types
import { css, html as h } from "react-strict-dom";

const styles = css.create({
	blue: {
		color: "blue",
	},
});

export default function Root({ children }: { children?: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<title>Kotekan</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</head>
			<body>
				<h.h1 style={styles.blue}>
					<h.a href="/">Kotekan</h.a>
				</h.h1>
				{children}
			</body>
		</html>
	);
}
