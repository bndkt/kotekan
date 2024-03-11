import type { ReactNode } from "react";

import { Layout } from "./components/layout/Layout";

export default function Root({ children }: { children?: ReactNode }) {
	return (
		<html lang="en" className="h-full">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="description" content="Kotekan" />
			</head>
			<body className="flex min-h-full bg-white antialiased dark:bg-zinc-900">
				<div className="w-full">
					<Layout>{children}</Layout>
				</div>
			</body>
		</html>
	);
}
