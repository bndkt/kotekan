import type { ReactNode } from "react";

import { Layout } from "./components/Layout";

export default function Root({ children }: { children?: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="description" content="Kotekan" />
			</head>
			<body>
				<Layout>{children}23235</Layout>
			</body>
		</html>
	);
}
