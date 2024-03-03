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
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="description" content="Kotekan" />
			</head>
			<body>
				<h.h1 style={styles.blue}>
					<h.a href="/">🥁 Kotekan</h.a>
				</h.h1>
				{children}
			</body>
		</html>
	);
}
