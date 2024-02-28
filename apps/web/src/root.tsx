// if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
// 	const runtime = require("react-refresh/runtime");
// 	runtime.injectIntoGlobalHook(window);
// 	window.$RefreshReg$ = () => {};
// 	window.$RefreshSig$ = () => (type) => type;
// 	console.log("Fast Refresh setup complete");
// }
import type { ReactNode } from "react";
import stylex from "@stylexjs/stylex";

const styles = stylex.create({
	blue: {
		color: "blue",
	},
});

export default function Root({ children }: { children?: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<title>Kotekan</title>
			</head>
			<body>
				<h1 {...stylex.props(styles.blue)}>Kotekan Web</h1>
				{children}
			</body>
		</html>
	);
}
