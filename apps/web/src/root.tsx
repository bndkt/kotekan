import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
	blue: {
		color: { default: "blue", ":visited": "red" },
	},
});

export default function Root({ children }: { children?: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="description" content="Kotekan" />
			</head>
			<body>
				<h1>
					<a href="/" {...stylex.props(styles.blue)}>
						🥁 Kotekan
					</a>
				</h1>
				{children}
			</body>
		</html>
	);
}
